"use client"

import { useState, useEffect } from "react"
import { Bookmark, Heart, Share2 } from "lucide-react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { useFavorites } from "@/hooks/use-favorites"
import { useWatchlist } from "@/hooks/use-watchlist"
import { useRecentlyViewed } from "@/hooks/use-recently-viewed"

interface Movie {
  id: number
  title: string
  posterPath: string
  rating: number
  releaseDate: string
  genreIds?: number[]
}

interface MovieActionsProps {
  movie: Movie
}

export function MovieActions({ movie }: MovieActionsProps) {
  const { toast } = useToast()
  const { favorites, addFavorite, removeFavorite, isFavorite } = useFavorites()
  const { watchlist, addToWatchlist, removeFromWatchlist, isInWatchlist } = useWatchlist()
  const { addToRecentlyViewed } = useRecentlyViewed()

  const [isFav, setIsFav] = useState(false)
  const [isWatchlist, setIsWatchlist] = useState(false)
  const [isHeartAnimating, setIsHeartAnimating] = useState(false)
  const [isBookmarkAnimating, setIsBookmarkAnimating] = useState(false)

  useEffect(() => {
    // Track this movie view - but only once when the component mounts
    addToRecentlyViewed(movie)

    // Initialize state
    setIsFav(isFavorite(movie.id))
    setIsWatchlist(isInWatchlist(movie.id))

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [addToRecentlyViewed, isFavorite, isInWatchlist, movie]) // Empty dependency array to run only on mount

  // Update state when favorites/watchlist changes
  useEffect(() => {
    setIsFav(isFavorite(movie.id))
  }, [favorites, movie, isFavorite, setIsFav])

  useEffect(() => {
    setIsWatchlist(isInWatchlist(movie.id))
  }, [watchlist, movie, isInWatchlist, setIsWatchlist])

  const handleFavoriteToggle = () => {
    setIsHeartAnimating(true)

    if (isFav) {
      removeFavorite(movie.id)
      toast({
        title: "Removed from favorites",
        description: `${movie.title} has been removed from your favorites`,
        variant: "default",
      })
    } else {
      addFavorite(movie)
      toast({
        title: "Added to favorites",
        description: `${movie.title} has been added to your favorites`,
        variant: "success",
      })
    }

    // Reset animation state after animation completes
    setTimeout(() => setIsHeartAnimating(false), 600)
  }

  const handleWatchlistToggle = () => {
    setIsBookmarkAnimating(true)

    if (isWatchlist) {
      removeFromWatchlist(movie.id)
      toast({
        title: "Removed from watchlist",
        description: `${movie.title} has been removed from your watchlist`,
        variant: "default",
      })
    } else {
      addToWatchlist(movie)
      toast({
        title: "Added to watchlist",
        description: `${movie.title} has been added to your watchlist`,
        variant: "success",
      })
    }

    // Reset animation state after animation completes
    setTimeout(() => setIsBookmarkAnimating(false), 600)
  }

  const handleShare = async () => {
    const url = window.location.href

    if (navigator.share) {
      try {
        await navigator.share({
          title: movie.title,
          text: `Check out ${movie.title} on Moxie!`,
          url: url,
        })
      } catch (error) {
        console.error("Error sharing:", error)
      }
    } else {
      // Fallback to clipboard
      try {
        await navigator.clipboard.writeText(url)
        toast({
          title: "Link copied",
          description: "Movie link copied to clipboard",
          variant: "success",
        })
      } catch (error) {
        console.error("Error copying to clipboard:", error)
      }
    }
  }

  return (
    <div className="flex flex-wrap gap-3">
      <Button
        variant={isFav ? "accent" : "outline"}
        className="rounded-full gap-2 group overflow-hidden"
        onClick={handleFavoriteToggle}
      >
        <motion.div
          animate={{
            rotate: isHeartAnimating ? [0, -15, 15, -15, 15, 0] : 0,
            scale: isHeartAnimating ? [1, 1.2, 1] : 1,
          }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
        >
          <Heart className={isFav ? "fill-accent-foreground" : ""} size={18} />
        </motion.div>
        <span className="relative overflow-hidden inline-block">
          <span className="inline-block transition-transform group-hover:-translate-y-full duration-300">
            {isFav ? "Favorited" : "Favorite"}
          </span>
          <span className="absolute top-0 left-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
            {isFav ? "Remove" : "Add"}
          </span>
        </span>
      </Button>

      <Button
        variant={isWatchlist ? "accent" : "outline"}
        className="rounded-full gap-2 group overflow-hidden"
        onClick={handleWatchlistToggle}
      >
        <motion.div
          animate={{
            rotate: isBookmarkAnimating ? [0, -15, 15, -15, 15, 0] : 0,
            scale: isBookmarkAnimating ? [1, 1.2, 1] : 1,
          }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
        >
          <Bookmark className={isWatchlist ? "fill-accent-foreground" : ""} size={18} />
        </motion.div>
        <span className="relative overflow-hidden inline-block">
          <span className="inline-block transition-transform group-hover:-translate-y-full duration-300">
            {isWatchlist ? "Watchlist" : "Watchlist"}
          </span>
          <span className="absolute top-0 left-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
            {isWatchlist ? "Remove" : "Add"}
          </span>
        </span>
      </Button>

      <Button variant="outline" className="rounded-full gap-2 group overflow-hidden" onClick={handleShare}>
        <Share2 size={18} />
        <span className="relative overflow-hidden inline-block">
          <span className="inline-block transition-transform group-hover:-translate-y-full duration-300">Share</span>
          <span className="absolute top-0 left-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
            Send
          </span>
        </span>
      </Button>
    </div>
  )
}

