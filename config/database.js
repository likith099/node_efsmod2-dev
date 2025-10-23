const sql = require('mssql');

// Database configuration for Azure SQL Database or SQL Server
const config = {
    server: process.env.DATABASE_SERVER || 'localhost',
    database: process.env.DATABASE_NAME || 'EFS_Module2',
    user: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    port: parseInt(process.env.DATABASE_PORT) || 1433,
    options: {
        encrypt: true, // Use encryption for Azure SQL Database
        trustServerCertificate: false, // For Azure SQL Database
        enableArithAbort: true,
        instancename: process.env.DATABASE_INSTANCE_NAME, // SQL Server instance name
        connectionTimeout: 30000,
        requestTimeout: 30000,
        pool: {
            max: 10,
            min: 0,
            idleTimeoutMillis: 30000
        }
    },
    // Azure Managed Identity configuration
    authentication: {
        type: process.env.DATABASE_AUTH_TYPE || 'default',
        options: {
            userName: process.env.DATABASE_USERNAME,
            password: process.env.DATABASE_PASSWORD
        }
    }
};

// Alternative configuration for Azure Managed Identity
const managedIdentityConfig = {
    server: process.env.DATABASE_SERVER,
    database: process.env.DATABASE_NAME,
    authentication: {
        type: 'azure-active-directory-msi-vm'
    },
    options: {
        encrypt: true,
        trustServerCertificate: false,
        enableArithAbort: true,
        connectionTimeout: 30000,
        requestTimeout: 30000
    }
};

class DatabaseManager {
    constructor() {
        this.pool = null;
        this.isConnected = false;
    }

    async connect() {
        try {
            console.log('Attempting to connect to database...');
            
            // Choose configuration based on authentication type
            const dbConfig = process.env.DATABASE_AUTH_TYPE === 'managed-identity' 
                ? managedIdentityConfig 
                : config;

            this.pool = await sql.connect(dbConfig);
            this.isConnected = true;
            
            console.log('Database connected successfully');
            return this.pool;
        } catch (error) {
            console.error('Database connection failed:', error);
            this.isConnected = false;
            throw error;
        }
    }

    async disconnect() {
        try {
            if (this.pool) {
                await this.pool.close();
                this.isConnected = false;
                console.log('Database disconnected successfully');
            }
        } catch (error) {
            console.error('Error disconnecting from database:', error);
            throw error;
        }
    }

    async query(queryText, parameters = {}) {
        try {
            if (!this.isConnected) {
                await this.connect();
            }

            const request = this.pool.request();
            
            // Add parameters to the request
            Object.keys(parameters).forEach(key => {
                request.input(key, parameters[key]);
            });

            const result = await request.query(queryText);
            return result;
        } catch (error) {
            console.error('Database query failed:', error);
            throw error;
        }
    }

    async testConnection() {
        try {
            const result = await this.query('SELECT 1 as test');
            return {
                success: true,
                message: 'Database connection test successful',
                data: result.recordset
            };
        } catch (error) {
            return {
                success: false,
                message: 'Database connection test failed',
                error: error.message
            };
        }
    }

    getConnectionStatus() {
        return {
            connected: this.isConnected,
            poolConnected: this.pool && this.pool.connected,
            server: config.server,
            database: config.database
        };
    }
}

// Export both the configuration and the manager class
module.exports = {
    config,
    managedIdentityConfig,
    DatabaseManager,
    // Export a singleton instance
    dbManager: new DatabaseManager()
};