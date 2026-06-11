// src/app/courses/loading.tsx
import { Skeleton } from '@/components/ui/Skeleton'

export default function CoursesLoading() {
  return (
    <main className="bg-black min-h-screen pt-24 px-6 md:px-10 pb-20">
      <div style={{ maxWidth: '1440px', margin: '0 auto' }}>
        <Skeleton className="h-3 w-16 mb-4" />
        <Skeleton className="h-14 w-44 mb-3" />
        <Skeleton className="h-4 w-80 mb-12" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="border border-dark-border overflow-hidden">
              <Skeleton className="h-48 w-full rounded-none" />
              <div className="p-6 flex flex-col gap-3">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
