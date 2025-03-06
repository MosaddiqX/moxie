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

export function useWatchlist() {
  const [watchlist, setWatchlist] = useLocalStorage<Movie[]>("watchlist", [])
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    setIsInitialized(true)
  }, [])

  const addToWatchlist = (movie: Movie) => {
    setWatchlist((prev) => {
      if (prev.some((m) => m.id === movie.id)) {
        return prev
      }
      return [...prev, movie]
    })
  }

  const removeFromWatchlist = (id: number) => {
    setWatchlist((prev) => prev.filter((movie) => movie.id !== id))
  }

  const isInWatchlist = (id: number) => {
    return watchlist.some((movie) => movie.id === id)
  }

  const exportWatchlist = () => {
    const dataStr = JSON.stringify(watchlist)
    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`

    const exportFileDefaultName = `moxie-watchlist-${new Date().toISOString().slice(0, 10)}.json`

    const linkElement = document.createElement("a")
    linkElement.setAttribute("href", dataUri)
    linkElement.setAttribute("download", exportFileDefaultName)
    linkElement.click()
  }

  const importWatchlist = (jsonData: string) => {
    try {
      const parsedData = JSON.parse(jsonData) as Movie[]
      setWatchlist(parsedData)
      return true
    } catch (error) {
      console.error("Error importing watchlist:", error)
      return false
    }
  }

  return {
    watchlist,
    addToWatchlist,
    removeFromWatchlist,
    isInWatchlist,
    exportWatchlist,
    importWatchlist,
    isInitialized,
  }
}

