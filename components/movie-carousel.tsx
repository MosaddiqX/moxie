"use client"

import { useState, useRef, useEffect } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { MovieCard } from "@/components/movie-card"
import { cn } from "@/lib/utils"

interface Movie {
  id: number
  title: string
  poster_path: string
  vote_average: number
  release_date: string
}

interface MovieCarouselProps {
  title: string
  movies: Movie[]
  className?: string
}

export function MovieCarousel({ title, movies, className }: MovieCarouselProps) {
  const [scrollPosition, setScrollPosition] = useState(0)
  const [maxScroll, setMaxScroll] = useState(0)
  const [isHovered, setIsHovered] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const updateMaxScroll = () => {
      if (containerRef.current) {
        setMaxScroll(containerRef.current.scrollWidth - containerRef.current.clientWidth)
      }
    }

    // Update on mount and when window resizes
    updateMaxScroll()
    window.addEventListener("resize", updateMaxScroll)

    return () => window.removeEventListener("resize", updateMaxScroll)
  }, [movies])

  const scroll = (direction: "left" | "right") => {
    if (containerRef.current) {
      const container = containerRef.current
      const scrollAmount = container.clientWidth * 0.75

      const newPosition =
        direction === "left"
          ? Math.max(scrollPosition - scrollAmount, 0)
          : Math.min(scrollPosition + scrollAmount, maxScroll)

      container.scrollTo({
        left: newPosition,
        behavior: "smooth",
      })

      setScrollPosition(newPosition)
    }
  }

  const handleScroll = () => {
    if (containerRef.current) {
      setScrollPosition(containerRef.current.scrollLeft)
    }
  }

  return (
    <motion.div
      className={cn("relative", className)}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.5 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-center justify-between mb-4">
        <motion.h2
          className="text-2xl font-bold font-playfair"
          initial={{ x: -20 }}
          whileInView={{ x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {title}
        </motion.h2>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full z-[999] transition-opacity duration-300"
            style={{ opacity: isHovered || scrollPosition > 0 ? 1 : 0.5 }}
            onClick={() => scroll("left")}
            disabled={scrollPosition <= 0}
          >
            <ChevronLeft className="h-5 w-5" />
            <span className="sr-only">Scroll left</span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full z-[999] transition-opacity duration-300"
            style={{ opacity: isHovered || scrollPosition < maxScroll ? 1 : 0.5 }}
            onClick={() => scroll("right")}
            disabled={scrollPosition >= maxScroll}
          >
            <ChevronRight className="h-5 w-5" />
            <span className="sr-only">Scroll right</span>
          </Button>
        </div>
      </div>

      <div
        ref={containerRef}
        className="flex gap-4 overflow-x-auto scrollbar-hide pb-4 -mx-4 px-4"
        onScroll={handleScroll}
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {movies.map((movie, index) => (
          <MovieCard
            key={movie.id}
            id={movie.id}
            title={movie.title}
            posterPath={movie.poster_path}
            rating={movie.vote_average}
            releaseDate={movie.release_date}
            className="min-w-[180px] md:min-w-[200px] flex-shrink-0"
          />
        ))}
      </div>
    </motion.div>
  )
}

