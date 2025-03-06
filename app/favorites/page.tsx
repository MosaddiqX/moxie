"use client"

import { useState, useEffect } from "react"
import { MovieCard } from "@/components/movie-card"
import { SkeletonCard } from "@/components/skeleton-card"
import { Button } from "@/components/ui/button"
import { useFavorites } from "@/hooks/use-favorites"

export default function FavoritesPage() {
  const { favorites, isInitialized } = useFavorites()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (isInitialized) {
      setIsLoading(false)
    }
  }, [isInitialized])

  return (
    <div className="container py-24 min-h-screen">
      <h1 className="text-4xl font-bold font-playfair mb-8">My Favorites</h1>

      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
          {Array(12)
            .fill(0)
            .map((_, i) => (
              <SkeletonCard key={i} />
            ))}
        </div>
      ) : favorites.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
          {favorites.map((movie) => (
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
          <h3 className="text-2xl font-medium mb-2">Your favorites list is empty</h3>
          <p className="text-muted-foreground mb-6">Add movies to your favorites to keep track of what you love</p>
          <Button asChild>
            <a href="/">Browse Movies</a>
          </Button>
        </div>
      )}
    </div>
  )
}

