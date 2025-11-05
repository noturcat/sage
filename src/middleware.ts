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
	'http://127.0.0.1:8000',
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

const baseSecureHeaders: Record<string, string> = {
	'X-Frame-Options': 'SAMEORIGIN',
	'X-Content-Type-Options': 'nosniff',
	'Referrer-Policy': 'strict-origin-when-cross-origin',
	'Permissions-Policy': 'camera=(), microphone=(), geolocation=(self)',
	'Content-Security-Policy': `default-src 'self'; connect-src ${cspConnectSrc}; img-src 'self' data: blob: https: http://127.0.0.1:8000 http://localhost:8000 https://servedbyadbutler.com https://dev.justholistics.com https://dev-api.justholistics.com; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com https://servedbyadbutler.com http://servedbyadbutler.com https://js.stripe.com; script-src-elem 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com https://servedbyadbutler.com http://servedbyadbutler.com https://js.stripe.com; style-src 'self' 'unsafe-inline'; font-src 'self' data: https:; frame-src 'self' https://www.googletagmanager.com https://js.stripe.com https://servedbyadbutler.com http://servedbyadbutler.com; worker-src 'self' blob:; base-uri 'self'; form-action 'self'; object-src 'none'`,
}

// const authRoutes = [/^\/community/, /^\/threads/, /^\/discover/]
const authRoutes = [/^\/directory/, /^\/messages/]

const directoryRoutes = [/^\/directory/]

// Public paths that must bypass auth (SEO & essentials)
const PUBLIC_ALLOW = ['/robots.txt', '/sitemap.xml', '/favicon.ico']

function isPublicBypass(pathname: string) {
	if (PUBLIC_ALLOW.includes(pathname)) return true
	// Allow any segmented sitemaps like /sitemap-0.xml, /sitemap-posts.xml, etc.
	if (/^\/sitemap-.*\.xml$/i.test(pathname)) return true
	// Next internals & common static buckets
	if (
		pathname.startsWith('/_next') ||
		pathname.startsWith('/icons') ||
		pathname.startsWith('/images') ||
		pathname.startsWith('/fonts')
	) {
		return true
	}
	return false
}

function withSecurityHeaders(req: NextRequest, res: NextResponse) {
	// Start with the base headers
	Object.entries(baseSecureHeaders).forEach(([k, v]) => res.headers.set(k, v))

	// Add X-Robots-Tag for dev/staging only (avoid on SEO files we explicitly allow)
	const host = req.nextUrl.hostname
	const isDevHost = DEV_HOSTS.has(host) || NOINDEX_FLAG
	const path = req.nextUrl.pathname

	const isSeoFile =
		path === '/robots.txt' || path === '/sitemap.xml' || /^\/sitemap-.*\.xml$/i.test(path)
	if (isDevHost && !isSeoFile) {
		// conservative directives to prevent indexing of HTML responses on dev
		res.headers.set('X-Robots-Tag', 'noindex, nofollow, noarchive, nosnippet')
	}

	return res
}

export function middleware(request: NextRequest) {
	const { pathname } = request.nextUrl

	if (isPublicBypass(pathname)) {
		return withSecurityHeaders(request, NextResponse.next())
	}

	if (pathname === '/api/health') {
		return withSecurityHeaders(request, NextResponse.next())
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
		// Exclude next internals, health, favicon, robots, sitemaps, and static buckets from middleware
		'/((?!_next|api/health|favicon.ico|robots.txt|sitemap\\.xml|sitemap-.*\\.xml|icons|images|fonts).*)',
	],
}
