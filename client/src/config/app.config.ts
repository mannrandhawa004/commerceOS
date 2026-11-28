/** App-wide constants. Safe to import from client, server and middleware. */
export const APP_NAME = 'CommerceOS';
export const APP_TAGLINE = 'Your commerce, in sync';

export const COOKIE_NAMES = {
  accessToken: 'commerce_access',
  refreshToken: 'commerce_refresh',
} as const;

export const ACCESS_TOKEN_MAX_AGE = 15 * 60;
