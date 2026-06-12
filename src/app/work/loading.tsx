// src/app/work/loading.tsx
import { Skeleton } from '@/components/ui/Skeleton'

export default function WorkLoading() {
  return (
    <main className="bg-[#F7F7F7] min-h-screen pt-24 px-6 md:px-10 pb-20">
      <div style={{ maxWidth: '1440px', margin: '0 auto' }}>
        <Skeleton className="h-3 w-24 mb-4" />
        <Skeleton className="h-14 w-48 mb-3" />
        <Skeleton className="h-4 w-64 mb-12" />
        <div className="flex gap-3 mb-10 flex-wrap">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-8 w-28" />
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-72 w-full" />
          ))}
        </div>
      </div>
    </main>
  )
}
