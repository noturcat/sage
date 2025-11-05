import ErrorBoundary from '@/components/util/error-boundary/ErrorBoundary'

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary>
      {children}
    </ErrorBoundary>
  )
}


