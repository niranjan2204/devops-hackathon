import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyToken } from './lib/auth'

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('auth_token')?.value
  const pathname = request.nextUrl.pathname

  // Protected routes for team leader
  const protectedPaths = ['/dashboard', '/problems']
  const isProtected = protectedPaths.some(p => pathname.startsWith(p))

  // Admin routes (UI and API)
  const isAdminRoute = (pathname.startsWith('/admin') || pathname.startsWith('/api/admin')) && pathname !== '/admin/login' && pathname !== '/api/admin/login'

  if (isProtected) {
    if (!token) return NextResponse.redirect(new URL('/login', request.url))
    const payload = await verifyToken(token)
    if (!payload || payload.role !== 'team_leader') {
      return NextResponse.redirect(new URL('/login', request.url))
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
