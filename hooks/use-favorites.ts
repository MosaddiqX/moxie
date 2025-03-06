"use client"

import { useState, useEffect } from "react"
import { useLocalStorage } from "@/hooks/use-local-storage"

interface Movie {
  id: number
  title: string
  posterPath: string
  rating: number
  releaseDate: string
}

export function useFavorites() {
  const [favorites, setFavorites] = useLocalStorage<Movie[]>("favorites", [])
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    setIsInitialized(true)
  }, [])

  const addFavorite = (movie: Movie) => {
    setFavorites((prev) => {
      if (prev.some((m) => m.id === movie.id)) {
        return prev
      }
      return [...prev, movie]
    })
  }

  const removeFavorite = (id: number) => {
    setFavorites((prev) => prev.filter((movie) => movie.id !== id))
  }

  const isFavorite = (id: number) => {
    return favorites.some((movie) => movie.id === id)
  }

  return {
    favorites,
    addFavorite,
    removeFavorite,
    isFavorite,
    isInitialized,
  }
}

