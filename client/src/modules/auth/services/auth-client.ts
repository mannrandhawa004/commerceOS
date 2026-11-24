import type { ApiResponse, UserProfile } from '../types/auth';

export async function authRequest<T>(action: string, body?: object): Promise<ApiResponse<T>> {
  let response: Response;
  try {
    response = await fetch('/api/auth/' + action, { method: body ? 'POST' : 'GET', headers: body ? { 'Content-Type': 'application/json' } : undefined, body: body ? JSON.stringify(body) : undefined, cache: 'no-store' });
  } catch { throw new Error('Unable to connect. Please check your connection and try again.'); }
  const result = await response.json() as ApiResponse<T>;
  if (!response.ok) throw new Error(result.message || 'Something went wrong. Please try again.');
  return result;
}
export const getSession = () => authRequest<UserProfile>('session');
