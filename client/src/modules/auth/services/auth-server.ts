import 'server-only';
import { NextResponse } from 'next/server';
import type { ApiResponse, TokenResponse } from '../types/auth';

const apiBase = (process.env.COMMERCE_API_URL || 'http://localhost:5000/api/v1').replace(/\/$/, '');
export const accessCookie = 'commerce_access';
export const refreshCookie = 'commerce_refresh';
export async function backend<T>(path: string, options: RequestInit = {}): Promise<{ status: number; payload: ApiResponse<T> }> {
  const res = await fetch(apiBase + path, { ...options, cache: 'no-store', headers: { 'Content-Type': 'application/json', ...options.headers } });
  return { status: res.status, payload: await res.json() as ApiResponse<T> };
}
const cookieOptions = { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax' as const, path: '/' };
export function setSession(response: NextResponse, tokens: TokenResponse) {
  response.cookies.set(accessCookie, tokens.accessToken, { ...cookieOptions, maxAge: 15 * 60 });
  response.cookies.set(refreshCookie, tokens.refreshToken, { ...cookieOptions, expires: new Date(tokens.expiresAt) });
}
export function clearSession(response: NextResponse) {
  response.cookies.set(accessCookie, '', { ...cookieOptions, maxAge: 0 });
  response.cookies.set(refreshCookie, '', { ...cookieOptions, maxAge: 0 });
}
export function fail(message: string, status: number) { return NextResponse.json({ success: false, message, error: { code: status === 401 ? 'UNAUTHORIZED' : 'REQUEST_FAILED' } }, { status }); }
