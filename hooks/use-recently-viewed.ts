"use client"

import { useState, useEffect, useCallback } from "react"
import { useLocalStorage } from "@/hooks/use-local-storage"

interface Movie {
  id: number
  title: string
  posterPath: string
  rating: number
  releaseDate: string
  viewedAt: string
  genreIds?: number[]
}

const MAX_RECENTLY_VIEWED = 20

export function useRecentlyViewed() {
  const [recentlyViewed, setRecentlyViewed] = useLocalStorage<Movie[]>("recently-viewed", [])
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    setIsInitialized(true)
  }, [])

  // Use useCallback to memoize the function
  const addToRecentlyViewed = useCallback(
    (movie: Omit<Movie, "viewedAt">) => {
      setRecentlyViewed((prev) => {
        // Skip update if movie is already at the top of the list
        if (prev.length > 0 && prev[0].id === movie.id) {
          return prev
        }

        // Remove if already exists
        const filtered = prev.filter((m) => m.id !== movie.id)

        // Add to the beginning with current timestamp
        const newItem = {
          ...movie,
          viewedAt: new Date().toISOString(),
        }

        // Limit to MAX_RECENTLY_VIEWED items
        return [newItem, ...filtered].slice(0, MAX_RECENTLY_VIEWED)
      })
    },
    [setRecentlyViewed],
  )

  const clearRecentlyViewed = useCallback(() => {
    setRecentlyViewed([])
  }, [setRecentlyViewed])

  return {
    recentlyViewed,
    addToRecentlyViewed,
    clearRecentlyViewed,
    isInitialized,
  }
}

