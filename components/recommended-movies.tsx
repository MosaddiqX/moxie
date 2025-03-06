"use client"

import { useEffect, useState } from "react"
import { useRecommendations } from "@/hooks/use-recommendations"
import { MovieCard } from "@/components/movie-card"
import { SkeletonCard } from "@/components/skeleton-card"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"

export function RecommendedMovies() {
  const { recommendedMovies, isLoading, hasEnoughData } = useRecommendations()
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Only show the section if we have enough data
    setIsVisible(hasEnoughData)
  }, [hasEnoughData])

  if (!isVisible) return null

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
          className="py-4"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold font-playfair">Movies You'll Love</h2>
            <Button variant="link" className="text-accent">
              View All
            </Button>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
              {Array(6)
                .fill(0)
                .map((_, i) => (
                  <SkeletonCard key={i} />
                ))}
            </div>
          ) : recommendedMovies.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
              {recommendedMovies.map((movie) => (
                <MovieCard
                  key={movie.id}
                  id={movie.id}
                  title={movie.title}
                  posterPath={movie.posterPath || movie.poster_path}
                  rating={movie.rating || movie.vote_average}
                  releaseDate={movie.releaseDate || movie.release_date}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Keep exploring movies to get personalized recommendations!</p>
            </div>
          )}
        </motion.section>
      )}
    </AnimatePresence>
  )
}

