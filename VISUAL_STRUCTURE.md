# EFSMOD Portal - Visual Structure Overview

## 🎨 Page Layout Structure

```
┌─────────────────────────────────────────────────────────────────────┐
│                         NAVIGATION HEADER                            │
│  [Logo] DEV EFSMOD Portal              [Sign In] [Sign Up]         │
└─────────────────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────────────────┐
│                                                                      │
│                         HERO BANNER IMAGE                            │
│                                                                      │
│                    ┌──────────────────────────┐                     │
│                    │   Welcome to EFSMOD     │  (Desktop Only)     │
│                    │   Portal                │                     │
│                    │                         │                     │
│                    │   [Sign in here →]     │                     │
│                    └──────────────────────────┘                     │
└─────────────────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────────────────┐
│                     MOBILE WELCOME SECTION                           │
│  Welcome to EFSMOD Portal                        (Mobile Only)      │
│  Already have an account? [Sign in here →]                         │
└─────────────────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────────────────┐
│                      INTRODUCTION TEXT                               │
│  Welcome to the EFSMOD Portal. This portal provides access to...    │
└─────────────────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────────────────┐
│                        SERVICE CARDS                                 │
│  ┌───────────────┐  ┌───────────────┐  ┌───────────────┐          │
│  │ ─────  (Red)  │  │ ─────  (Blue) │  │ ───── (Green) │          │
│  │               │  │               │  │               │          │
│  │  Resource &   │  │   Service     │  │   Program     │          │
│  │   Referral    │  │ Application   │  │  Enrollment   │          │
│  │               │  │               │  │               │          │
│  │ Description   │  │ Description   │  │ Description   │          │
│  │ text here...  │  │ text here...  │  │ text here...  │          │
│  │               │  │               │  │               │          │
│  │ [Learn More →]│  │ [Apply →]     │  │ [Apply →]     │          │
│  └───────────────┘  └───────────────┘  └───────────────┘          │
└─────────────────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────────────────┐
│                           FOOTER                                     │
│  Please contact your local support center for assistance.           │
│  Browser recommendations and compatibility information.              │
└─────────────────────────────────────────────────────────────────────┘
```

## 📱 Component Breakdown

### 1. Navigation Header (nav-header)
```
Components:
├── Logo Image (desktop & mobile variants)
├── Environment Label ("DEV EFSMOD Portal")
└── Action Buttons
    ├── Sign In Button → redirects to /signin
    └── Sign Up Button → opens modal
```

### 2. Hero Section (hero-section)
```
Components:
├── Hero Banner Image (full-width)
└── Sign-In Overlay Box (desktop only)
    ├── Heading: "Welcome to EFSMOD Portal"
    ├── Subheading: "Already have an account?"
    └── Sign In Link Button
```

### 3. Mobile Welcome (mobile-only)
```
Components:
├── Welcome Message
└── Sign In Link
```

### 4. Service Cards Grid (cards-grid)
```
Each Card Contains:
├── Colored Top Border (4px)
│   ├── Red: #AE0C06
│   ├── Blue: #01689B
│   └── Green: #248641
├── Card Title (colored to match border)
├── Card Body (description text)
└── Action Button (colored to match border)
    └── Button Text + Arrow Icon
```

### 5. Footer (footer)
```
Components:
├── Support Contact Link
├── Browser Recommendation
└── Apple Device Instructions
```

## 🎨 Color Usage Map

```
Navigation:
├── Background: #FFFFFF (white)
├── Border: #F1F1F1 (light gray)
├── Buttons: #01689B (blue)
└── Environment Label: #FF0000 (red)

Hero Section:
├── Overlay Background: #01689B (blue)
├── Text: #FFFFFF (white)
└── Button Background: #FFFFFF (white)
    └── Button Text: #01689B (blue)

Service Cards:
├── Card 1 - Resource & Referral
│   ├── Border: #AE0C06 (red)
│   ├── Title: #AE0C06 (red)
│   └── Button: #AE0C06 (red)
├── Card 2 - Service Application
│   ├── Border: #01689B (blue)
│   ├── Title: #01689B (blue)
│   └── Button: #01689B (blue)
└── Card 3 - Program Enrollment
    ├── Border: #248641 (green)
    ├── Title: #248641 (green)
    └── Button: #248641 (green)

Text:
├── Primary: #2D2D2D
├── Secondary: #4B4B4B
└── Links: #01689B
```

## 📐 Spacing & Layout

### Desktop (≥768px)
```
┌─────────────────────────────────────┐
│ Container: max-width 1200px, centered
│ Padding: 0 20px
│
│ Navigation: padding 2rem
│ Hero: margin-top 80px (nav height)
│
│ Cards Grid:
│ ├── 3 columns
│ ├── Gap: 20px
│ └── Min card width: 300px
│
│ Footer: padding 20px, margin-top 40px
└─────────────────────────────────────┘
```

### Mobile (<768px)
```
┌─────────────────┐
│ Container: 100% width
│ Padding: 0 15px
│
│ Navigation: padding 1rem
│
│ Cards Grid:
│ ├── 1 column
│ ├── Gap: 15px
│ └── Full width
│
│ Footer: padding 15px
└─────────────────┘
```

## 🔤 Typography Scale

```
Desktop:
├── Hero Title: 32px, font-weight: 700
├── Hero Subtitle: 20px, font-weight: 400
├── Card Title: 20px, font-weight: 600
├── Card Body: 14px, font-weight: 400
├── Button Text: 13px, font-weight: 400
└── Footer Text: 14px, font-weight: 400

Mobile:
├── Hero Title: 18px, font-weight: 700
├── Hero Subtitle: 16px, font-weight: 400
├── Card Title: 20px, font-weight: 600
├── Card Body: 14px, font-weight: 400
└── Button Text: 13px, font-weight: 400
```

## 🎯 Interactive Elements

### Buttons
```css
Normal State:
├── Background: Brand color
├── Text: #FFFFFF
├── Padding: 10px 20px
└── Border-radius: 3px

Hover State:
├── Opacity: 0.9
└── Cursor: pointer

Focus State:
└── Outline: 2px solid #01689B
```

### Links
```css
Normal State:
└── Color: #01689B

Hover State:
└── Text-decoration: underline

Focus State:
└── Outline: 2px solid #01689B
```

### Cards
```css
Container:
├── Border: 1px solid #D2D2D2
├── Border-radius: 4px
├── Background: #FFFFFF
└── Box-shadow: none

On Hover:
└── (No change - static cards)
```

## 📦 Modal Structure

```
┌─────────────────────────────────────┐
│ Modal Overlay (rgba(0,0,0,0.4))    │
│  ┌───────────────────────────────┐  │
│  │ Modal Dialog                  │  │
│  │ ┌───────────────────────────┐ │  │
│  │ │ Header (Blue #01689B)     │ │  │
│  │ │ ℹ Single Sign-On      [×] │ │  │
│  │ └───────────────────────────┘ │  │
│  │ ┌───────────────────────────┐ │  │
│  │ │ Body (White)              │ │  │
│  │ │ Information text...       │ │  │
│  │ │                           │ │  │
│  │ │ [Proceed to SSO →]        │ │  │
│  │ └───────────────────────────┘ │  │
│  │ ┌───────────────────────────┐ │  │
│  │ │ Footer                    │ │  │
│  │ │              [Cancel]     │ │  │
│  │ └───────────────────────────┘ │  │
│  └───────────────────────────────┘  │
└─────────────────────────────────────┘
```

## 🔄 Responsive Breakpoints

```
┌─────────────────────────────────────────┐
│ Mobile: 0px - 767px                     │
│ ├── Single column layout                │
│ ├── Simplified navigation               │
│ ├── Smaller text sizes                  │
│ └── Full-width cards                    │
├─────────────────────────────────────────┤
│ Tablet: 768px - 1023px                  │
│ ├── 2-3 column grid                     │
│ ├── Full navigation                     │
│ └── Standard text sizes                 │
├─────────────────────────────────────────┤
│ Desktop: 1024px+                        │
│ ├── 3 column grid                       │
│ ├── Hero overlay visible                │
│ └── Maximum container width: 1200px     │
└─────────────────────────────────────────┘
```

## 📊 File Organization

```
CSS Cascade Order:
1. flwins-styles.css      (Design system foundation)
2. flwins-components.css  (Reusable components)
3. portal.css             (Portal-wide styles)
4. efsmod-home.css        (Home page specific)
5. styles.css             (Additional utilities)

JavaScript Load Order:
1. flwins-main.js         (Core utilities)
2. portal-nav.js          (Navigation logic)
3. efsmod-home.js         (Home page features)
```

## 🎭 States & Interactions

```
Page Load:
├── Scroll to top
├── Initialize tooltips
├── Set up modal handlers
└── Start idle timer (if authenticated)

User Clicks Sign Up:
├── Open modal
├── Display SSO information
└── Focus on modal content

User Clicks Proceed:
├── Close modal
└── Redirect to /create-account

User Idle (28 min):
├── Show warning modal
└── Start 30-second countdown

User Clicks Stay Logged In:
├── Close warning modal
├── Reset idle timer
└── Continue session
```

## 🎨 Visual Hierarchy

```
Primary Focus:
└── Hero Section + Welcome Message

Secondary Focus:
└── Service Cards (equal weight)

Tertiary Focus:
├── Navigation
└── Footer

Background Elements:
└── Body background, borders, spacing
```

---

This visual structure guide provides a comprehensive overview of the EFSMOD Portal's layout, components, and design system implementation.
