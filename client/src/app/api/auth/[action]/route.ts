import { type NextRequest } from 'next/server';
import { handleAuthGet, handleAuthPost } from '@/modules/auth/controllers/auth.controller';

export const dynamic = 'force-dynamic';

type Context = { params: Promise<{ action: string }> };

/** Thin transport layer. All logic lives in the auth controller. */
export async function POST(request: NextRequest, { params }: Context) {
  const { action } = await params;
  return handleAuthPost(request, action);
}

export async function GET(request: NextRequest, { params }: Context) {
  const { action } = await params;
  return handleAuthGet(request, action);
}
