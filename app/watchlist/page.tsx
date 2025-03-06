"use client"

import { useState, useEffect } from "react"
import { MovieCard } from "@/components/movie-card"
import { SkeletonCard } from "@/components/skeleton-card"
import { Button } from "@/components/ui/button"
import { useWatchlist } from "@/hooks/use-watchlist"
import { useToast } from "@/hooks/use-toast"
import { Download, Upload } from "lucide-react"

export default function WatchlistPage() {
  const { watchlist, exportWatchlist, importWatchlist, isInitialized } = useWatchlist()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (isInitialized) {
      setIsLoading(false)
    }
  }, [isInitialized])

  const handleImport = () => {
    const input = document.createElement("input")
    input.type = "file"
    input.accept = ".json"

    input.onchange = (e: any) => {
      const file = e.target.files[0]
      if (!file) return

      const reader = new FileReader()
      reader.onload = (event) => {
        try {
          const result = event.target?.result as string
          const success = importWatchlist(result)

          if (success) {
            toast({
              title: "Watchlist imported",
              description: "Your watchlist has been successfully imported",
              variant: "success",
            })
          } else {
            toast({
              title: "Import failed",
              description: "Failed to import watchlist. Invalid format.",
              variant: "destructive",
            })
          }
        } catch (error) {
          toast({
            title: "Import failed",
            description: "Failed to import watchlist",
            variant: "destructive",
          })
        }
      }

      reader.readAsText(file)
    }

    input.click()
  }

  return (
    <div className="container py-24 min-h-screen">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <h1 className="text-4xl font-bold font-playfair">My Watchlist</h1>

        <div className="flex gap-3">
          <Button variant="outline" className="gap-2" onClick={exportWatchlist} disabled={watchlist.length === 0}>
            <Download size={16} />
            Export
          </Button>
          <Button variant="outline" className="gap-2" onClick={handleImport}>
            <Upload size={16} />
            Import
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
          {Array(12)
            .fill(0)
            .map((_, i) => (
              <SkeletonCard key={i} />
            ))}
        </div>
      ) : watchlist.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
          {watchlist.map((movie) => (
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
          <h3 className="text-2xl font-medium mb-2">Your watchlist is empty</h3>
          <p className="text-muted-foreground mb-6">
            Add movies to your watchlist to keep track of what you want to watch
          </p>
          <Button asChild>
            <a href="/">Browse Movies</a>
          </Button>
        </div>
      )}
    </div>
  )
}

