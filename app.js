const path = require("path");
const fs = require("fs");
const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;

const MICROSOFT_CLIENT_ID =
  process.env.AZURE_AD_CLIENT_ID || "84b2dfe9-f72d-4f93-a55d-08e5735bf2a5";
const MICROSOFT_TENANT_ID = process.env.AZURE_AD_TENANT_ID?.trim() || "common";
const MICROSOFT_SCOPES =
  process.env.AZURE_AD_SCOPES?.trim() || "openid profile email offline_access";
const MICROSOFT_REDIRECT_PATH =
  process.env.AZURE_AD_REDIRECT_PATH?.trim() || "/auth/callback";

const buildAuthorizeEndpoint = (tenantId = "common") =>
  `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/authorize`;

const buildRedirectUri = (req, pathSegment) => {
  const protocol = req.get("x-forwarded-proto") || req.protocol;
  return `${protocol}://${req.get("host")}${pathSegment}`;
};

const buildMicrosoftLoginUrl = (req, options = {}) => {
  const overrideTenant = options.tenant || req.query.tenant;
  const tenantNormalized = (overrideTenant || MICROSOFT_TENANT_ID || "common")
    .toString()
    .trim();
  const authorizeUrl = buildAuthorizeEndpoint(
    tenantNormalized.length > 0 ? tenantNormalized : "common"
  );

  const params = new URLSearchParams({
    client_id: options.clientId || MICROSOFT_CLIENT_ID,
    response_type: options.responseType || "code",
    response_mode: options.responseMode || "query",
    scope: options.scope || MICROSOFT_SCOPES,
    redirect_uri:
      options.redirectUri ||
      buildRedirectUri(req, options.redirectPath || MICROSOFT_REDIRECT_PATH),
  });

  if (options.prompt || req.query.prompt) {
    params.set("prompt", options.prompt || `${req.query.prompt}`.trim());
  }

  if (options.state || req.query.state) {
    params.set("state", options.state || `${req.query.state}`);
  }

  if (options.loginHint || req.query.login_hint) {
    params.set("login_hint", options.loginHint || `${req.query.login_hint}`);
  }

  return `${authorizeUrl}?${params.toString()}`;
};

const getAppBaseUrl = (req) => {
  const protocol = req.get("x-forwarded-proto") || req.protocol;
  return `${protocol}://${req.get("host")}`;
};

class AuthenticationError extends Error {
  constructor(message, status = 500) {
    super(message);
    this.status = status;
  }
}

const getClaimValue = (claims = [], claimTypes = []) => {
  for (const type of claimTypes) {
    const claimMatch = claims.find((claim) => claim.typ === type);
    if (claimMatch?.val) {
      return claimMatch.val;
    }
  }
  return null;
};

const fetchAuthenticationPrincipal = async (req) => {
  const headers = {
    cookie: req.headers.cookie || "",
    "x-zumo-auth": req.headers["x-zumo-auth"] || "",
  };

  const authEndpoint = `${getAppBaseUrl(req)}/.auth/me`;
  const response = await fetch(authEndpoint, { headers });

  if (response.status === 401) {
    return null;
  }

  if (!response.ok) {
    throw new AuthenticationError(
      `Azure authentication endpoint responded with status ${response.status}`,
      response.status
    );
  }

  const payload = await response.json();
  return payload?.[0] || null;
};

const mapPrincipalToProfile = (principal) => {
  if (!principal) {
    return null;
  }

  const claims = principal.user_claims || [];

  return {
    id: principal.user_id,
    name: getClaimValue(claims, [
      "name",
      "http://schemas.microsoft.com/identity/claims/displayname",
      "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name",
    ]),
    givenName: getClaimValue(claims, [
      "given_name",
      "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/givenname",
    ]),
    surname: getClaimValue(claims, [
      "family_name",
      "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/surname",
    ]),
    email: getClaimValue(claims, [
      "preferred_username",
      "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress",
      "upn",
    ]),
    identityProvider: principal.identity_provider,
    userPrincipalName: getClaimValue(claims, ["upn"]),
    tenantId: principal.tenant_id,
  };
};

const sendPublicFileOrFallback = (res, statusCode, fileName, fallbackMessage) => {
  const resolvedPath = path.join(__dirname, "public", fileName);

  if (fs.existsSync(resolvedPath)) {
    return res.status(statusCode).sendFile(resolvedPath);
  }

  console.warn(
    `Static page ${fileName} is missing at ${resolvedPath}. Falling back to plain text response.`
  );

  return res
    .status(statusCode)
    .type("text/plain")
    .send(fallbackMessage || "An unexpected error occurred.");
};

app.use(
  helmet({
    contentSecurityPolicy: false,
  })
);
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "efsmod.html"));
});

app.get("/signin", (req, res) => {
  res.redirect(buildMicrosoftLoginUrl(req));
});

app.get("/create-account", (req, res) => {
  res.redirect(buildMicrosoftLoginUrl(req));
});

app.get("/signout", (req, res) => {
  res.redirect("/.auth/logout");
});

app.get("/status", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "status.html"));
});

app.get("/health", (req, res) => {
  res.type("text/plain").send("healthy");
});

app.get("/auth/callback", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "auth-callback.html"));
});

app.get("/api/auth/status", async (req, res) => {
  try {
    const principal = await fetchAuthenticationPrincipal(req);

    if (!principal) {
      return res.json({
        authenticated: false,
        user: null,
      });
    }

    const profile = mapPrincipalToProfile(principal);
    res.json({
      authenticated: true,
      user: profile,
    });
  } catch (error) {
    const status = error instanceof AuthenticationError ? error.status : 500;
    if (!(error instanceof AuthenticationError)) {
      console.error("Auth status error:", error);
    }

    res.status(status).json({
      authenticated: false,
      error: error.message || "Unable to determine authentication status",
    });
  }
});

app.get("/api/profile", async (req, res) => {
  try {
    const principal = await fetchAuthenticationPrincipal(req);

    if (!principal) {
      return res.status(401).json({
        error: "User not authenticated",
        authenticated: false,
      });
    }

    const profile = mapPrincipalToProfile(principal);

    res.json({
      authenticated: true,
      profile,
      claims: principal.user_claims || [],
      identityProvider: principal.identity_provider,
    });
  } catch (error) {
    const status = error instanceof AuthenticationError ? error.status : 500;
    if (!(error instanceof AuthenticationError)) {
      console.error("Profile endpoint error:", error);
    }

    res.status(status).json({
      authenticated: false,
      error: error.message || "Unable to retrieve profile information",
    });
  }
});

app.use((req, res, next) => {
  if (req.method !== "GET") {
    return next();
  }

  sendPublicFileOrFallback(
    res,
    404,
    "404.html",
    "The requested resource could not be found."
  );
});

app.use((err, req, res, next) => {
  console.error("Application error:", err);

  if (res.headersSent) {
    return next(err);
  }

  sendPublicFileOrFallback(
    res,
    500,
    "500.html",
    "An unexpected error occurred while processing your request."
  );
});

app.listen(port, () => {
  console.log(`Web application listening on port ${port}`);
});
