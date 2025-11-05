import { NextRequest, NextResponse } from 'next/server'

const tsHost = process.env.NEXT_PUBLIC_TYPESENSE_HOST
const tsProtocol = process.env.NEXT_PUBLIC_TYPESENSE_PROTOCOL || 'https'
const tsPort = process.env.NEXT_PUBLIC_TYPESENSE_PORT
const tsOrigin = tsHost
	? `${tsProtocol}://${tsHost}${tsPort && tsPort !== '443' ? `:${tsPort}` : ''}`
	: ''

const DEV_HOSTS = new Set(['dev.justholistics.com'])
const NOINDEX_FLAG = process.env.NEXT_PUBLIC_NOINDEX === '1'

const cspConnectSrc = [
	"'self'",
	'http://localhost:8000',
	'https://dev-api.justholistics.com',
	'https://www.google-analytics.com',
	'https://www.googletagmanager.com',
	'https://servedbyadbutler.com',
	'http://servedbyadbutler.com',
	'https://js.stripe.com',
	'https://api.stripe.com',
	tsOrigin,
]
	.filter(Boolean)
	.join(' ')

const secureHeaders: Record<string, string> = {
	'X-Frame-Options': 'SAMEORIGIN',
	'X-Content-Type-Options': 'nosniff',
	'Referrer-Policy': 'strict-origin-when-cross-origin',
	'Permissions-Policy': 'camera=(), microphone=(), geolocation=(self)',
	'Content-Security-Policy': `default-src 'self'; connect-src ${cspConnectSrc}; img-src 'self' data: blob: https: http://127.0.0.1:8000 http://localhost:8000 https://servedbyadbutler.com; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com https://servedbyadbutler.com http://servedbyadbutler.com https://js.stripe.com; script-src-elem 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com https://servedbyadbutler.com http://servedbyadbutler.com https://js.stripe.com; style-src 'self' 'unsafe-inline'; font-src 'self' data: https:; frame-src 'self' https://www.googletagmanager.com https://js.stripe.com https://servedbyadbutler.com http://servedbyadbutler.com; worker-src 'self' blob:; base-uri 'self'; form-action 'self'; object-src 'none'`,
}

// const authRoutes = [/^\/community/, /^\/threads/, /^\/discover/]
const authRoutes = [/^\/directory/]
const directoryRoutes = [/^\/directory/]

// Naive in-memory rate limiter
const RATE_LIMIT_WINDOW_MS = 60_000
const RATE_LIMIT_MAX = 100
const ipHits = new Map<string, { count: number; expires: number }>()

function rateLimit(ip: string): boolean {
	const now = Date.now()
	const entry = ipHits.get(ip)
	if (!entry || now > entry.expires) {
		ipHits.set(ip, { count: 1, expires: now + RATE_LIMIT_WINDOW_MS })
		return true
	}
	if (entry.count >= RATE_LIMIT_MAX) return false
	entry.count += 1
	return true
}

// Public paths that must bypass auth/rate-limit (SEO & essentials)
const PUBLIC_ALLOW = ['/robots.txt', '/sitemap.xml', '/favicon.ico']

function isSeoFile(pathname: string) {
	return (
		pathname === '/robots.txt' ||
		pathname === '/sitemap.xml' ||
		/^\/sitemap-.*\.xml$/i.test(pathname)
	)
}

function isPublicBypass(pathname: string) {
	if (PUBLIC_ALLOW.includes(pathname)) return true
	if (isSeoFile(pathname)) return true
	if (
		pathname.startsWith('/_next') ||
		pathname.startsWith('/icons') ||
		pathname.startsWith('/images') ||
		pathname.startsWith('/fonts') ||
		pathname === '/api/health'
	) {
		return true
	}
	return false
}

function withSecurityHeaders(req: NextRequest, res: NextResponse) {
	// Base security headers
	Object.entries(secureHeaders).forEach(([k, v]) => res.headers.set(k, v))

	// Add X-Robots-Tag to prevent indexing on dev hosts or when flag is set
	const host = req.nextUrl.hostname
	const isDevHost = DEV_HOSTS.has(host) || NOINDEX_FLAG
	const path = req.nextUrl.pathname

	if (isDevHost && !isSeoFile(path)) {
		res.headers.set('X-Robots-Tag', 'noindex, nofollow, noarchive, nosnippet')
	}

	return res
}

export function middleware(request: NextRequest) {
	const { pathname } = request.nextUrl

	// Always allow SEO/static/health through (and skip rate limiting)
	if (isPublicBypass(pathname)) {
		return withSecurityHeaders(request, NextResponse.next())
	}

	// Rate limit (skip for SEO/health due to early return above)
	const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'
	if (!rateLimit(String(ip))) {
		return withSecurityHeaders(request, new NextResponse('Too Many Requests', { status: 429 }))
	}

	const token = request.cookies.get('userToken')?.value
	const userRole = request.cookies.get('userRole')?.value || 'guest'

	if (authRoutes.some(re => re.test(pathname))) {
		if (!token) {
			const url = new URL('/sign-up', request.url)
			return withSecurityHeaders(request, NextResponse.redirect(url))
		}
	}

	if (directoryRoutes.some(re => re.test(pathname))) {
		if (userRole !== 'business') {
			const url = new URL('/', request.url)
			return withSecurityHeaders(request, NextResponse.redirect(url))
		}
	}

	return withSecurityHeaders(request, NextResponse.next())
}

export const config = {
	matcher: [
		// Exclude next internals, health, favicon, robots, sitemaps, and static buckets
		'/((?!_next|api/health|favicon\\.ico|robots\\.txt|sitemap\\.xml|sitemap-.*\\.xml|icons|images|fonts).*)',
	],
}
