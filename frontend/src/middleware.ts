import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyToken } from './lib/auth'

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('hackathon_token')?.value
  const pathname = request.nextUrl.pathname

  // Protected routes for team leader
  const protectedPaths = ['/dashboard', '/problems']
  const isProtected = protectedPaths.some(p => pathname.startsWith(p))

  // Admin routes (UI and API)
  const isAdminRoute = (pathname.startsWith('/admin') || pathname.startsWith('/api/admin')) && pathname !== '/admin/login' && pathname !== '/api/admin/login'

  if (isProtected) {
    console.log("[Middleware] Protected route accessed:", pathname)
    console.log("[Middleware] Token present?", !!token)
    if (!token) return new NextResponse("Middleware Error: No token found");
    const payload = await verifyToken(token)
    console.log("[Middleware] Verified payload:", payload)
    if (!payload || payload.role !== 'team_leader') {
      console.log("[Middleware] Redirecting because payload is invalid or role mismatch")
      return new NextResponse("Middleware Error: Invalid payload or role");
    }
  }

  if (isAdminRoute) {
    if (!token) return NextResponse.redirect(new URL('/admin/login', request.url))
    const payload = await verifyToken(token)
    if (!payload || payload.role !== 'admin') {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*', '/problems/:path*', '/admin/:path*', '/api/admin/:path*'],
}
