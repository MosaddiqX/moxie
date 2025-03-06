"use client"

import { useEffect, useState, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion, useScroll, useTransform } from "framer-motion"
import { Star, Clock, Calendar, TrendingUp, BarChart3 } from "lucide-react"
import { MovieActions } from "@/components/movie-actions"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface MovieDetailHeroProps {
  movie: any
}

export function MovieDetailHero({ movie }: MovieDetailHeroProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  })

  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 1.1])
  const contentY = useTransform(scrollYProgress, [0, 0.5], [0, 50])

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  // Fix for NaN issue - ensure runtime is a number
  const runtime = typeof movie.runtime === "number" ? movie.runtime : 0

  // Format runtime to hours and minutes
  const formatRuntime = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hours}h ${mins}m`
  }

  // Format budget and revenue
  const formatCurrency = (amount: number) => {
    if (!amount) return "N/A"
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      notation: "compact",
      maximumFractionDigits: 1,
    }).format(amount)
  }

  // Calculate profit/loss percentage
  const calculateProfitLoss = () => {
    if (!movie.budget || !movie.revenue) return null

    const profit = movie.revenue - movie.budget
    const percentage = (profit / movie.budget) * 100

    return {
      value: profit,
      percentage: percentage.toFixed(1),
      isProfit: profit > 0,
    }
  }

  const profitLoss = calculateProfitLoss()

  return (
    <div ref={containerRef} className="relative w-full h-[90vh] overflow-hidden">
      <motion.div className="absolute inset-0" style={{ opacity, scale }}>
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-background/20 z-10" />
        <div className="absolute inset-0 bg-gradient-to-r from-background to-transparent z-10" />

        <Image
          src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
          alt={movie.title}
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
      </motion.div>

      <motion.div className="container relative z-20 flex h-full items-end pb-24 pt-48" style={{ y: contentY }}>
        <div className="flex flex-col md:flex-row gap-8 items-start mt-auto w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="hidden md:block rounded-lg overflow-hidden shadow-2xl w-64 flex-shrink-0 relative group"
          >
            <Image
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={movie.title}
              width={256}
              height={384}
              className="w-full h-auto transition-transform duration-500 group-hover:scale-105"
            />

            {/* Overlay with movie info on hover */}
            <div className="absolute inset-0 bg-black/70 flex flex-col justify-end p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              {movie.vote_count > 0 && (
                <div className="mb-2">
                  <span className="text-sm text-white/70">Based on</span>
                  <div className="font-medium text-white">{movie.vote_count.toLocaleString()} votes</div>
                </div>
              )}

              {movie.status && (
                <div className="mb-2">
                  <span className="text-sm text-white/70">Status</span>
                  <div className="font-medium text-white">{movie.status}</div>
                </div>
              )}

              {movie.original_language && (
                <div className="mb-2">
                  <span className="text-sm text-white/70">Language</span>
                  <div className="font-medium text-white">{movie.original_language.toUpperCase()}</div>
                </div>
              )}

              {movie.popularity > 0 && (
                <div className="flex items-center gap-1 text-white">
                  <TrendingUp className="h-4 w-4" />
                  <span>Popularity: {movie.popularity.toFixed(1)}</span>
                </div>
              )}
            </div>
          </motion.div>

          <div className="flex-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-wrap items-center gap-3 mb-3"
            >
              {movie.status === "Released" && (
                <Badge variant="outline" className="bg-green-500/20 text-green-500 border-green-500/30">
                  Released
                </Badge>
              )}

              {movie.adult && (
                <Badge variant="outline" className="bg-red-500/20 text-red-500 border-red-500/30">
                  18+
                </Badge>
              )}

              {movie.original_language && <Badge variant="outline">{movie.original_language.toUpperCase()}</Badge>}
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-4xl md:text-5xl font-bold font-playfair mb-4 bg-gradient-to-r from-white to-white/80 dark:from-white dark:to-white/70 bg-clip-text text-transparent"
            >
              {movie.title}
              {movie.release_date && (
                <span className="text-xl text-muted-foreground ml-2">
                  ({new Date(movie.release_date).getFullYear()})
                </span>
              )}
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex flex-wrap items-center gap-4 mb-4 text-sm"
            >
              <div className="flex items-center gap-1 bg-accent/20 text-accent px-2 py-1 rounded-full">
                <Star className="h-4 w-4 fill-accent text-accent" />
                <span>{movie.vote_average.toFixed(1)}</span>
              </div>

              {runtime > 0 && (
                <div className="flex items-center gap-1 bg-secondary/30 px-2 py-1 rounded-full">
                  <Clock className="h-4 w-4" />
                  <span>{formatRuntime(runtime)}</span>
                </div>
              )}

              {movie.release_date && (
                <div className="flex items-center gap-1 bg-secondary/30 px-2 py-1 rounded-full">
                  <Calendar className="h-4 w-4" />
                  <span>{new Date(movie.release_date).toLocaleDateString()}</span>
                </div>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="flex flex-wrap gap-2 mb-6"
            >
              {movie.genres.map((genre: any) => (
                <Link
                  key={genre.id}
                  href={`/movies?genre=${genre.id}`}
                  className="bg-secondary/50 hover:bg-secondary/70 px-3 py-1 rounded-full text-sm transition-colors"
                >
                  {genre.name}
                </Link>
              ))}
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="text-lg text-muted-foreground mb-6"
            >
              {movie.overview}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }}
              transition={{ duration: 0.5, delay: 0.7 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
            >
              {movie.budget > 0 && (
                <div className="bg-card/50 p-3 rounded-lg border border-border/50">
                  <div className="text-sm text-muted-foreground mb-1">Budget</div>
                  <div className="font-medium">{formatCurrency(movie.budget)}</div>
                </div>
              )}

              {movie.revenue > 0 && (
                <div className="bg-card/50 p-3 rounded-lg border border-border/50">
                  <div className="text-sm text-muted-foreground mb-1">Revenue</div>
                  <div className="font-medium">{formatCurrency(movie.revenue)}</div>
                </div>
              )}

              {profitLoss && (
                <div
                  className={cn(
                    "bg-card/50 p-3 rounded-lg border border-border/50",
                    profitLoss.isProfit ? "bg-green-500/10" : "bg-red-500/10",
                  )}
                >
                  <div className="text-sm text-muted-foreground mb-1">Profit/Loss</div>
                  <div
                    className={cn(
                      "font-medium flex items-center gap-1",
                      profitLoss.isProfit ? "text-green-500" : "text-red-500",
                    )}
                  >
                    <BarChart3 className="h-4 w-4" />
                    {formatCurrency(profitLoss.value)} ({profitLoss.percentage}%)
                  </div>
                </div>
              )}

              {movie.production_companies && movie.production_companies.length > 0 && (
                <div className="bg-card/50 p-3 rounded-lg border border-border/50">
                  <div className="text-sm text-muted-foreground mb-1">Studio</div>
                  <div className="font-medium truncate">{movie.production_companies[0].name}</div>
                </div>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }}
              transition={{ duration: 0.5, delay: 0.7 }}
            >
              <MovieActions
                key={movie.id}
                movie={{
                  id: movie.id,
                  title: movie.title,
                  posterPath: movie.poster_path,
                  rating: movie.vote_average,
                  releaseDate: movie.release_date,
                }}
              />
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

