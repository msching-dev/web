import { Skeleton } from '@/components/ui/skeleton'

export default function ProductDetailSkeleton() {
  return (
    <div className="grid gap-5 md:gap-8 md:grid-cols-2">
      {/* Image */}
      <Skeleton className="aspect-square w-full rounded-2xl shimmer" />

      {/* Details */}
      <div className="space-y-4">
        <Skeleton className="h-7 w-3/4 rounded-xl shimmer" />
        <Skeleton className="h-6 w-1/4 rounded-xl shimmer" />
        <div className="space-y-2.5 pt-3">
          <Skeleton className="h-3.5 w-full rounded-lg shimmer" />
          <Skeleton className="h-3.5 w-full rounded-lg shimmer" />
          <Skeleton className="h-3.5 w-5/6 rounded-lg shimmer" />
          <Skeleton className="h-3.5 w-4/6 rounded-lg shimmer" />
        </div>
      </div>
    </div>
  )
}
