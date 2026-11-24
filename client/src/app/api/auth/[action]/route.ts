import { NextRequest, NextResponse } from 'next/server';
import { accessCookie, backend, clearSession, fail, refreshCookie, setSession } from '../../../../modules/auth/services/auth-server';
import type { AuthUser, TokenResponse, UserProfile } from '../../../../modules/auth/types/auth';

export const dynamic = 'force-dynamic';
type Context = { params: Promise<{ action: string }> };
const expired = () => { const response = fail('Session expired. Please sign in again.', 401); clearSession(response); return response; };

export async function POST(request: NextRequest, { params }: Context) {
  const { action } = await params;
  if (!['login', 'register', 'logout'].includes(action)) return fail('Not found.', 404);
  const origin = request.headers.get('origin');
  if (!origin || origin !== request.nextUrl.origin) return fail('Invalid request origin.', 403);
  if (!request.headers.get('content-type')?.toLowerCase().startsWith('application/json')) return fail('Expected JSON.', 415);
  try {
    const body: unknown = await request.json();
    if (!body || typeof body !== 'object' || Array.isArray(body)) return fail('Invalid request.', 400);
    if (action === 'logout') {
      const refreshToken = request.cookies.get(refreshCookie)?.value;
      if (refreshToken) {
        const result = await backend<null>('/auth/logout', { method: 'POST', body: JSON.stringify({ refreshToken }) });
        if (result.status >= 500) return fail('Unable to sign out. Please try again.', 503);
      }
      const response = NextResponse.json({ success: true, message: 'Logged out successfully', data: null }); clearSession(response); return response;
    }
    if (action === 'register') {
      const result = await backend<AuthUser>('/auth/register', { method: 'POST', body: JSON.stringify(body) });
      return NextResponse.json(result.payload, { status: result.status });
    }
    const result = await backend<TokenResponse & { user: AuthUser }>('/auth/login', { method: 'POST', body: JSON.stringify(body) });
    if (!result.payload.success) return NextResponse.json(result.payload, { status: result.status });
    const response = NextResponse.json({ success: true, message: result.payload.message, data: { user: result.payload.data.user } });
    setSession(response, result.payload.data); return response;
  } catch (error) {
    if (error instanceof SyntaxError) return fail('Invalid JSON.', 400);
    return fail('Unable to reach the authentication service. Please try again.', 503);
  }
}
export async function GET(request: NextRequest, { params }: Context) {
  if ((await params).action !== 'session') return fail('Not found.', 404);
  const accessToken = request.cookies.get(accessCookie)?.value;
  const refreshToken = request.cookies.get(refreshCookie)?.value;
  try {
    if (accessToken) {
      const profile = await backend<UserProfile>('/auth/me', { headers: { Authorization: 'Bearer ' + accessToken } });
      if (profile.status === 200) return NextResponse.json(profile.payload);
      if (profile.status !== 401) return NextResponse.json(profile.payload, { status: profile.status });
    }
    if (!refreshToken) return expired();
    const refresh = await backend<TokenResponse>('/auth/refresh', { method: 'POST', body: JSON.stringify({ refreshToken }) });
    if (refresh.status === 401) return expired();
    if (!refresh.payload.success) return NextResponse.json(refresh.payload, { status: refresh.status });
    try {
      const profile = await backend<UserProfile>('/auth/me', { headers: { Authorization: 'Bearer ' + refresh.payload.data.accessToken } });
      if (profile.status === 401) return expired();
      const response = NextResponse.json(profile.payload, { status: profile.status });
      setSession(response, refresh.payload.data); return response;
    } catch {
      const response = fail('Unable to reach the authentication service. Please try again.', 503);
      setSession(response, refresh.payload.data);
      return response;
    }
  } catch { return fail('Unable to reach the authentication service. Please try again.', 503); }
}
