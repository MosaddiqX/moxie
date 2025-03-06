"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Heart, Star } from "lucide-react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"
import { useFavorites } from "@/hooks/use-favorites"

interface MovieCardProps {
  id: number
  title: string
  posterPath: string
  rating: number
  releaseDate: string
  className?: string
}

export function MovieCard({ id, title, posterPath, rating, releaseDate, className }: MovieCardProps) {
  const { toast } = useToast()
  const { favorites, addFavorite, removeFavorite } = useFavorites()
  const isFavorite = favorites.some((fav) => fav.id === id)
  const [isHovered, setIsHovered] = useState(false)
  const [isHeartAnimating, setIsHeartAnimating] = useState(false)

  const handleFavoriteToggle = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    setIsHeartAnimating(true)

    if (isFavorite) {
      removeFavorite(id)
      toast({
        title: "Removed from favorites",
        description: `${title} has been removed from your favorites`,
        variant: "default",
      })
    } else {
      addFavorite({
        id,
        title,
        posterPath,
        rating,
        releaseDate,
      })
      toast({
        title: "Added to favorites",
        description: `${title} has been added to your favorites`,
        variant: "success",
      })
    }

    // Reset animation state after animation completes
    setTimeout(() => setIsHeartAnimating(false), 600)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -5 }}
      className={cn("movie-card relative overflow-hidden rounded-lg bg-card", className)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link href={`/movie/${id}`} className="block h-full">
        <div className="relative aspect-[2/3] overflow-hidden">
          <Image
            src={posterPath ? `https://image.tmdb.org/t/p/w500${posterPath}` : "/placeholder.svg?height=450&width=300"}
            alt={title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 ease-out"
            style={{
              transform: isHovered ? "scale(1.05)" : "scale(1)",
            }}
          />

          <div
            className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent transition-opacity duration-300"
            style={{ opacity: isHovered ? 1 : 0 }}
          />

          <motion.button
            onClick={handleFavoriteToggle}
            className="absolute top-2 right-2 z-10 rounded-full p-1.5 bg-black/40 backdrop-blur-sm transition-all duration-300"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{
              opacity: isHovered ? 1 : 0,
              scale: isHovered ? 1 : 0.8,
              rotate: isHeartAnimating ? [0, -15, 15, -15, 15, 0] : 0,
            }}
            transition={{
              duration: 0.3,
              rotate: { duration: 0.6, ease: "easeInOut" },
            }}
          >
            <Heart
              className={cn("h-5 w-5 transition-all duration-300", isFavorite ? "fill-white text-white" : "text-white")}
            />
          </motion.button>

          <motion.div
            className="absolute bottom-0 left-0 right-0 p-3"
            initial={{ y: 60, opacity: 0 }}
            animate={{
              y: isHovered ? 0 : 60,
              opacity: isHovered ? 1 : 0,
            }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center gap-1 text-white mb-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-medium">{rating.toFixed(1)}</span>
            </div>
            <h3 className="text-white font-medium line-clamp-1">{title}</h3>
            <p className="text-white/80 text-sm">{new Date(releaseDate).getFullYear()}</p>
          </motion.div>
        </div>
      </Link>
    </motion.div>
  )
}

