export interface AuthUser { id: string; firstName: string; lastName: string; email: string }
export interface UserProfile { _id: string; firstName: string; lastName: string; email: string; status: string; createdAt: string; lastLoginAt?: string | null }
export interface ApiResponse<T> { success: boolean; message: string; data: T; error?: { code: string; details?: unknown } }
export interface TokenResponse { accessToken: string; refreshToken: string; expiresAt: string }
