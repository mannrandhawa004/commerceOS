import { NextResponse, type NextRequest } from 'next/server';
import { COOKIE_NAMES } from '@/config/app.config';
import { ERROR_CODES } from '@/shared/errors/error-codes';
import { fail, sendSuccess } from '@/shared/response/api-response';
import { AUTH_ACTIONS, SESSION_EXPIRED_MESSAGE } from '../constants/auth.constants';
import { authServer, clearSession, setSession } from '../services/auth-server.service';
import type { AuthUser, LoginInput, RegisterInput, TokenResponse } from '../types/auth';
import { loginSchema, registerSchema } from '../validators/auth.validator';

const POST_ACTIONS: readonly string[] = [AUTH_ACTIONS.login, AUTH_ACTIONS.register, AUTH_ACTIONS.logout];
const SERVICE_UNAVAILABLE = 'Unable to reach the authentication service. Please try again.';

function expired() {
  const response = fail(SESSION_EXPIRED_MESSAGE, 401, ERROR_CODES.UNAUTHORIZED);
  clearSession(response);
  return response;
}

/** Route handlers stay thin; all BFF orchestration lives here. */
export async function handleAuthPost(request: NextRequest, action: string) {
  if (!POST_ACTIONS.includes(action)) {
    return fail('Not found.', 404, ERROR_CODES.ROUTE_NOT_FOUND);
  }

  const origin = request.headers.get('origin');
  if (!origin || origin !== request.nextUrl.origin) {
    return fail('Invalid request origin.', 403);
  }
  if (!request.headers.get('content-type')?.toLowerCase().startsWith('application/json')) {
    return fail('Expected JSON.', 415);
  }

  let rawBody: unknown;
  try {
    rawBody = await request.json();
  } catch {
    return fail('Invalid JSON.', 400, ERROR_CODES.VALIDATION_ERROR);
  }
  if (!rawBody || typeof rawBody !== 'object' || Array.isArray(rawBody)) {
    return fail('Invalid request.', 400, ERROR_CODES.VALIDATION_ERROR);
  }

  try {
    if (action === AUTH_ACTIONS.logout) {
      const refreshToken = request.cookies.get(COOKIE_NAMES.refreshToken)?.value;
      if (refreshToken) {
        const result = await authServer.logout(refreshToken);
        if (result.status >= 500) return fail('Unable to sign out. Please try again.', 503);
      }
      const response = sendSuccess(null, 'Logged out successfully');
      clearSession(response);
      return response;
    }

    const schema = action === AUTH_ACTIONS.register ? registerSchema : loginSchema;
    const parsed = schema.safeParse(rawBody);
    if (!parsed.success) {
      return fail('Validation failed.', 400, ERROR_CODES.VALIDATION_ERROR, parsed.error.flatten());
    }

    if (action === AUTH_ACTIONS.register) {
      const result = await authServer.register(parsed.data as RegisterInput);
      return NextResponse.json(result.payload, { status: result.status });
    }

    const result = await authServer.login(parsed.data as LoginInput);
    if (!result.payload.success) {
      return NextResponse.json(result.payload, { status: result.status });
    }
    const user: AuthUser = result.payload.data.user;
    const response = sendSuccess({ user }, result.payload.message);
    setSession(response, result.payload.data);
    return response;
  } catch {
    return fail(SERVICE_UNAVAILABLE, 503);
  }
}

export async function handleAuthGet(request: NextRequest, action: string) {
  if (action !== AUTH_ACTIONS.session) {
    return fail('Not found.', 404, ERROR_CODES.ROUTE_NOT_FOUND);
  }

  const accessToken = request.cookies.get(COOKIE_NAMES.accessToken)?.value;
  const refreshToken = request.cookies.get(COOKIE_NAMES.refreshToken)?.value;

  try {
    if (accessToken) {
      const profile = await authServer.me(accessToken);
      if (profile.status === 200) return NextResponse.json(profile.payload);
      if (profile.status !== 401) return NextResponse.json(profile.payload, { status: profile.status });
    }

    if (!refreshToken) return expired();

    const refresh = await authServer.refresh(refreshToken);
    if (refresh.status === 401) return expired();
    if (!refresh.payload.success) {
      return NextResponse.json(refresh.payload, { status: refresh.status });
    }

    const tokens: TokenResponse = refresh.payload.data;
    const profile = await authServer.me(tokens.accessToken);
    if (profile.status === 401) return expired();
    if (profile.status >= 500) {
      const response = fail(SERVICE_UNAVAILABLE, 503);
      setSession(response, tokens);
      return response;
    }

    const response = NextResponse.json(profile.payload, { status: profile.status });
    setSession(response, tokens);
    return response;
  } catch {
    return fail(SERVICE_UNAVAILABLE, 503);
  }
}
