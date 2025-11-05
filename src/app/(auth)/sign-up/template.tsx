import PageSuspense from '@/components/util/page-suspense/PageSuspense'

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <PageSuspense>
      {children}
    </PageSuspense>
  )
}


