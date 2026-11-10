import { createMiddlewareSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { type NextRequest, NextResponse } from 'next/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareSupabaseClient({ req, res });

  // Refresh session if expired - required for Server Components
  // This also verifies cookies are being sent correctly
  await supabase.auth.getSession();

  const pathname = req.nextUrl.pathname;

  // Protect admin routes
  if (pathname.startsWith('/admin')) {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      // Redirect to login if no session
      const redirectUrl = new URL('/login', req.url);
      return NextResponse.redirect(redirectUrl);
    }

    // Check user role from profiles table
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .single();

    if (error || !profile || profile.role !== 'admin') {
      // Return 403 if not admin
      return new NextResponse('Forbidden', {
        status: 403,
        headers: { 'Content-Type': 'text/plain' },
      });
    }
  }

  return res;
}

export const config = {
  matcher: ['/admin/:path*', '/profile/:path*'],
};
