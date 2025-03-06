"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Play, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { getImagePath } from "@/lib/utils";
import { Movie } from "@/types";

interface HeroSectionProps {
  movie: Movie | undefined;
  isLoading: boolean;
}

export default function HeroSection({ movie, isLoading }: HeroSectionProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  if (isLoading || !movie) {
    return (
      <div className="relative w-full h-[70vh] md:h-[80vh] flex items-center">
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-background/20" />
        <Skeleton className="absolute inset-0" />
        <div className="container mx-auto px-4 relative z-10 mt-16">
          <div className="max-w-3xl">
            <Skeleton className="h-12 w-3/4 mb-4" />
            <Skeleton className="h-6 w-1/2 mb-2" />
            <Skeleton className="h-24 w-full mb-6" />
            <div className="flex gap-4">
              <Skeleton className="h-12 w-32" />
              <Skeleton className="h-12 w-32" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-[70vh] md:h-[80vh] flex items-center">
      {/* Background Image */}
      <div className="absolute inset-0 overflow-hidden">
        <Image
          src={
            getImagePath(movie.backdrop_path, "original") || "/placeholder.svg"
          }
          alt={movie.title}
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-background/20" />
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 relative z-10 mt-16">
        <div className="max-w-3xl">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4"
          >
            {movie.title}
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex items-center gap-4 mb-4 text-muted-foreground"
          >
            <div className="flex items-center">
              <Star className="w-5 h-5 text-yellow-500 mr-1 fill-yellow-500" />
              <span>{movie.vote_average.toFixed(1)}</span>
            </div>
            <span>•</span>
            <span>{movie.release_date?.split("-")[0]}</span>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-lg text-muted-foreground mb-8 line-clamp-3"
          >
            {movie.overview}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex flex-wrap gap-4"
          >
            <Link href={`/movie/${movie.id}`}>
              <Button size="lg" className="gap-2">
                <Play className="w-5 h-5 fill-current" />
                Watch Now
              </Button>
            </Link>

            <Link href={`/movie/${movie.id}`}>
              <Button variant="outline" size="lg">
                More Info
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
