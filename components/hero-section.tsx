"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Play, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface Movie {
  id: number
  title: string
  overview: string
  backdrop_path: string
  poster_path: string
  vote_average: number
  release_date: string
  genres: { id: number; name: string }[]
}

interface HeroSectionProps {
  movies: Movie[]
  className?: string
}

export function HeroSection({ movies, className }: HeroSectionProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isLoaded, setIsLoaded] = useState(false)
  const currentMovie = movies[currentIndex]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % movies.length)
    }, 8000)

    return () => clearInterval(interval)
  }, [movies.length])

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  return (
    <section className={cn("relative min-h-[80vh] md:min-h-[90vh] w-full overflow-hidden", className)}>
      <AnimatePresence mode="wait">
        <motion.div
          key={currentMovie.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className="absolute inset-0"
        >
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-background/20 z-10" />
          <div className="absolute inset-0 bg-gradient-to-r from-background to-transparent z-10" />

          <Image
            src={`https://image.tmdb.org/t/p/original${currentMovie.backdrop_path}`}
            alt={currentMovie.title}
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
        </motion.div>
      </AnimatePresence>

      <div className="container relative z-20 flex flex-col justify-end h-full pb-24 pt-48">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="max-w-3xl mt-auto"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={currentMovie.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex items-center gap-2 mb-3">
                <div className="flex items-center gap-1 bg-accent/20 text-accent px-2 py-1 rounded-full text-sm">
                  <Star className="h-3.5 w-3.5 fill-accent text-accent" />
                  <span>{currentMovie.vote_average.toFixed(1)}</span>
                </div>
                <div className="flex gap-2">
                  {currentMovie.genres.slice(0, 3).map((genre) => (
                    <span key={genre.id} className="bg-secondary/50 px-2 py-1 rounded-full text-xs">
                      {genre.name}
                    </span>
                  ))}
                </div>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-playfair mb-4">{currentMovie.title}</h1>

              <p className="text-lg text-muted-foreground mb-6 line-clamp-3 md:line-clamp-none">
                {currentMovie.overview}
              </p>

              <div className="flex flex-wrap gap-4">
                <Button asChild size="lg" className="rounded-full gap-2 group">
                  <Link href={`/movie/${currentMovie.id}`}>
                    <Play className="h-5 w-5 fill-current transition-transform group-hover:scale-110" />
                    <span className="relative overflow-hidden">
                      <span className="inline-block transition-transform group-hover:-translate-y-full duration-300">
                        Watch Trailer
                      </span>
                      <span className="absolute top-0 left-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                        Watch Now
                      </span>
                    </span>
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="rounded-full overflow-hidden group">
                  <Link href={`/movie/${currentMovie.id}`}>
                    <span className="relative overflow-hidden inline-block">
                      <span className="inline-block transition-transform group-hover:-translate-y-full duration-300">
                        View Details
                      </span>
                      <span className="absolute top-0 left-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                        Explore More
                      </span>
                    </span>
                  </Link>
                </Button>
              </div>
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {movies.map((_, index) => (
          <button
            key={index}
            className={cn(
              "w-2 h-2 rounded-full transition-all duration-300",
              index === currentIndex ? "bg-accent w-6" : "bg-muted hover:bg-muted-foreground",
            )}
            onClick={() => setCurrentIndex(index)}
          />
        ))}
      </div>
    </section>
  )
}

