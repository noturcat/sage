## Just Holistics

### Added Infrastructure

- i18n via next-intl with a simple client provider and cookie-based language switcher
- React Query provider with DevTools and MSW bootstrap (guarded by `NEXT_PUBLIC_ENABLE_MSW`)
- Axios API client with auth header interceptor under `src/lib/axios.ts`
- Repository pattern example in `src/repositories/AuthRepository.ts`
- RBAC middleware and component wrapper at `middleware.ts` and `src/middleware/withRBAC.tsx`
- Error Boundaries via `src/components/util/error-boundary/ErrorBoundary.tsx` and segment `template.tsx`
- PWA manifest and config, sitemap and robots

### Environment

Create `.env.local` with:

```
NEXT_PUBLIC_SITE_URL=https://example.com
NEXT_PUBLIC_API_URL=https://api.example.com/api
NEXT_PUBLIC_ENABLE_MSW=false
NEXT_PUBLIC_TIME_ZONE=UTC
```