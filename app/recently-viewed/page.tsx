"use client"

import { useState, useEffect } from "react"
import { MovieCard } from "@/components/movie-card"
import { SkeletonCard } from "@/components/skeleton-card"
import { Button } from "@/components/ui/button"
import { useRecentlyViewed } from "@/hooks/use-recently-viewed"
import { Trash2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function RecentlyViewedPage() {
  const { recentlyViewed, clearRecentlyViewed, isInitialized } = useRecentlyViewed()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (isInitialized) {
      setIsLoading(false)
    }
  }, [isInitialized])

  const handleClear = () => {
    clearRecentlyViewed()
    toast({
      title: "History cleared",
      description: "Your recently viewed history has been cleared",
      variant: "default",
    })
  }

  return (
    <div className="container py-24 min-h-screen">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <h1 className="text-4xl font-bold font-playfair">Recently Viewed</h1>

        {recentlyViewed.length > 0 && (
          <Button variant="outline" className="gap-2" onClick={handleClear}>
            <Trash2 size={16} />
            Clear History
          </Button>
        )}
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
          {Array(12)
            .fill(0)
            .map((_, i) => (
              <SkeletonCard key={i} />
            ))}
        </div>
      ) : recentlyViewed.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
          {recentlyViewed.map((movie) => (
            <MovieCard
              key={movie.id}
              id={movie.id}
              title={movie.title}
              posterPath={movie.posterPath}
              rating={movie.rating}
              releaseDate={movie.releaseDate}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <h3 className="text-2xl font-medium mb-2">No recently viewed movies</h3>
          <p className="text-muted-foreground mb-6">Movies you view will appear here</p>
          <Button asChild>
            <a href="/">Browse Movies</a>
          </Button>
        </div>
      )}
    </div>
  )
}

