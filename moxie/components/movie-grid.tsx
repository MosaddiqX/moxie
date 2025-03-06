"use client";

import { motion } from "framer-motion";
import MovieCard from "@/components/movie-card";
import { Skeleton } from "@/components/ui/skeleton";
import { Movie } from "@/types";

interface MovieGridProps {
  movies: Movie[];
  isLoading: boolean;
}

export default function MovieGrid({ movies, isLoading }: MovieGridProps) {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
        {Array(12)
          .fill(0)
          .map((_, i) => (
            <div key={i}>
              <Skeleton className="w-full aspect-[2/3] rounded-lg" />
              <Skeleton className="w-3/4 h-4 mt-2" />
              <Skeleton className="w-1/2 h-3 mt-1" />
            </div>
          ))}
      </div>
    );
  }

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6"
    >
      {movies.map((movie) => (
        <motion.div key={movie.id} variants={item}>
          <MovieCard movie={movie} />
        </motion.div>
      ))}
    </motion.div>
  );
}
