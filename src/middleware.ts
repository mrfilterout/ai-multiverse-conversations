import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Simple in-memory rate limiter
const rateLimit = new Map()

function getRateLimitKey(req: NextRequest): string {
  // Use IP address or fallback to a generic key
  const ip = req.headers.get('x-forwarded-for') || 
             req.headers.get('x-real-ip') || 
             'anonymous'
  return `${ip}:${req.nextUrl.pathname}`
}

export function middleware(request: NextRequest) {
  // Only apply rate limiting to API routes
  if (request.nextUrl.pathname.startsWith('/api/')) {
    const key = getRateLimitKey(request)
    const now = Date.now()
    const windowMs = 60 * 1000 // 1 minute window
    const maxRequests = 30 // 30 requests per minute
    
    // Clean up old entries
    const cutoff = now - windowMs
    for (const [k, v] of rateLimit.entries()) {
      if (v.firstRequest < cutoff) {
        rateLimit.delete(k)
      }
    }
    
    // Check rate limit
    const current = rateLimit.get(key) || { count: 0, firstRequest: now }
    
    if (current.count >= maxRequests && now - current.firstRequest < windowMs) {
      return new NextResponse('Too Many Requests', { status: 429 })
    }
    
    // Update count
    rateLimit.set(key, {
      count: current.count + 1,
      firstRequest: current.firstRequest
    })
  }
  
  // Add cache headers for static content
  const response = NextResponse.next()
  
  // Cache static assets
  if (request.nextUrl.pathname.match(/\.(jpg|jpeg|png|gif|ico|css|js)$/)) {
    response.headers.set('Cache-Control', 'public, max-age=31536000, immutable')
  }
  
  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}