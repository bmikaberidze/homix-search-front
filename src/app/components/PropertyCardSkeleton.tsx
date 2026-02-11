import { Skeleton } from '@/app/components/ui/skeleton';

export default function PropertyCardSkeleton() {
  return (
    <div className="w-[280px] bg-white rounded-[8px] border-[1.5px] border-[#f0effb]">
      {/* Image skeleton */}
      <Skeleton className="h-[140px] rounded-t-[8px]" />

      {/* Content skeleton */}
      <div className="p-[12px] space-y-3">
        <Skeleton className="h-[14px] w-[80%]" />
        <Skeleton className="h-[11px] w-[60%]" />
        <Skeleton className="h-[18px] w-[40%]" />

        {/* Features skeleton */}
        <div className="flex gap-2">
          <Skeleton className="h-[11px] w-[50px]" />
          <Skeleton className="h-[11px] w-[50px]" />
          <Skeleton className="h-[11px] w-[50px]" />
        </div>

        {/* Owner info skeleton */}
        <div className="mt-2 p-2 bg-[#fafaff] rounded-[6px]">
          <Skeleton className="h-[11px] w-[70%]" />
        </div>

        {/* Button skeleton */}
        <Skeleton className="h-[32px] w-full rounded-[6px]" />
      </div>
    </div>
  );
}
