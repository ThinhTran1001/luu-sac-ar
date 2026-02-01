export const COOKIE_CONFIG = {
  ACCESS_TOKEN_NAME: process.env.COOKIE_NAME || 'access_token',
  OPTIONS: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: (process.env.COOKIE_SAME_SITE as 'strict' | 'lax' | 'none') || 'lax',
    maxAge: Number(process.env.COOKIE_MAX_AGE) || 7 * 24 * 60 * 60 * 1000, // Default: 7 days
    path: process.env.COOKIE_PATH || '/',
    domain: process.env.COOKIE_DOMAIN, // Optional: for cross-subdomain cookies
  },
} as const;
