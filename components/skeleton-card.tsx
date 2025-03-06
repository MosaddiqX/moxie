import { cn } from "@/lib/utils"

interface SkeletonCardProps {
  className?: string
}

export function SkeletonCard({ className }: SkeletonCardProps) {
  return (
    <div className={cn("rounded-lg overflow-hidden", className)}>
      <div className="relative aspect-[2/3] bg-muted animate-pulse" />
      <div className="p-2 space-y-2">
        <div className="h-4 bg-muted rounded animate-pulse" />
        <div className="h-3 bg-muted rounded w-2/3 animate-pulse" />
      </div>
    </div>
  )
}

