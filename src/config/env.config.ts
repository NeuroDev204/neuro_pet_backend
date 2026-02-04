export const env = {
    // Server
    port: parseInt(process.env.PORT || '3000', 10),
    nodeEnv: process.env.NODE_ENV || 'development',

    // MongoDB
    mongoUri: process.env.MONGO_URI!,

    // JWT
    jwt: {
        secret: process.env.JWT_SECRET!,
        refreshSecret: process.env.JWT_REFRESH_SECRET!,
        expiresIn: Number(process.env.JWT_EXPIRES_IN),
        refreshExpiresIn: Number(process.env.JWT_REFRESH_EXPIRES_IN),
    },

    // Mail
    mail: {
        host: process.env.MAIL_HOST!,
        port: parseInt(process.env.MAIL_PORT || '587', 10),
        user: process.env.MAIL_USER!,
        pass: process.env.MAIL_PASS!,
        from: process.env.MAIL_FROM!,
    },
    // cloudinary
    cloudinary: {
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET
    },

    // Cookie
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict' as const,
    }
};

// Validate required environment variables
const requiredEnvVars = [
    'MONGO_URI',
    'JWT_SECRET',
    'JWT_REFRESH_SECRET',
    'JWT_EXPIRES_IN',
    'JWT_REFRESH_EXPIRES_IN',
];

export function validateEnv(): void {
    const missing = requiredEnvVars.filter((key) => !process.env[key]);
    if (missing.length > 0) {
        throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
    }
}
