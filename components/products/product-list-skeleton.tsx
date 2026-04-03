import { Skeleton } from '@/components/ui/skeleton'

export default function ProductListSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-2.5 sm:gap-3 md:grid-cols-3 lg:grid-cols-5">
      {Array.from({ length: 10 }).map((_, i) => (
        <div
          key={i}
          className="overflow-hidden rounded-2xl bg-white ring-1 ring-sandrift-100/40"
        >
          <Skeleton className="aspect-[4/5] w-full shimmer" />
          <div className="px-3 py-2.5 sm:px-3.5 sm:py-3">
            <Skeleton className="h-3.5 w-3/4 rounded-md shimmer" />
            <div className="mt-2 flex items-center justify-between">
              <Skeleton className="h-3.5 w-1/3 rounded-md shimmer" />
              <Skeleton className="h-3 w-8 rounded-md shimmer" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
