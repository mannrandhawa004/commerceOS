export const AUTH_ACTIONS = {
  login: 'login',
  register: 'register',
  logout: 'logout',
  session: 'session',
} as const;

export type AuthAction = (typeof AUTH_ACTIONS)[keyof typeof AUTH_ACTIONS];

export const SESSION_EXPIRED_MESSAGE = 'Session expired. Please sign in again.';
