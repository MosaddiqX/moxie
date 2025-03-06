"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import MovieCard from "@/components/movie-card";
import { Movie } from "@/types";

interface MovieCarouselProps {
  title: string;
  movies: Movie[];
  isLoading: boolean;
}

export default function MovieCarousel({
  title,
  movies,
  isLoading,
}: MovieCarouselProps) {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [showLeftButton, setShowLeftButton] = useState(false);
  const [showRightButton, setShowRightButton] = useState(true);

  const handleScroll = () => {
    if (!carouselRef.current) return;

    const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
    setShowLeftButton(scrollLeft > 0);
    setShowRightButton(scrollLeft < scrollWidth - clientWidth - 10);
  };

  const scroll = (direction: "left" | "right") => {
    if (!carouselRef.current) return;

    const { clientWidth } = carouselRef.current;
    const scrollAmount =
      direction === "left" ? -clientWidth / 1.5 : clientWidth / 1.5;

    carouselRef.current.scrollBy({
      left: scrollAmount,
      behavior: "smooth",
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative"
    >
      <h2 className="text-2xl font-bold mb-6">{title}</h2>

      <div className="relative group">
        {showLeftButton && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-0 top-1/2 -translate-y-1/2 z-[999] bg-background/80 backdrop-blur-sm rounded-full shadow-lg"
            onClick={() => scroll("left")}
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
        )}

        {showRightButton && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-0 top-1/2 -translate-y-1/2 z-[999] bg-background/80 backdrop-blur-sm rounded-full shadow-lg"
            onClick={() => scroll("right")}
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
        )}

        <div
          ref={carouselRef}
          className="flex gap-4 overflow-x-auto scrollbar-hide pb-4 pt-2 px-1"
          onScroll={handleScroll}
        >
          {isLoading
            ? Array(6)
                .fill(0)
                .map((_, i) => (
                  <div key={i} className="flex-shrink-0 w-[180px]">
                    <Skeleton className="w-full aspect-[2/3] rounded-lg" />
                    <Skeleton className="w-3/4 h-4 mt-2" />
                    <Skeleton className="w-1/2 h-3 mt-1" />
                  </div>
                ))
            : movies.map((movie) => (
                <div key={movie.id} className="flex-shrink-0 w-[180px]">
                  <MovieCard movie={movie} />
                </div>
              ))}
        </div>
      </div>
    </motion.div>
  );
}
