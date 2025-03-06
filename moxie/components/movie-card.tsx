"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";
import { getImagePath } from "@/lib/utils";
import { Movie } from "@/types";

interface MovieCardProps {
  movie: Movie;
}

export default function MovieCard({ movie }: MovieCardProps) {
  return (
    <Link href={`/movie/${movie.id}`}>
      <motion.div
        className="movie-card rounded-lg overflow-hidden h-full flex flex-col"
        whileHover={{ y: -5 }}
        transition={{ duration: 0.3 }}
      >
        <div className="relative aspect-[2/3] bg-muted">
          <Image
            src={
              movie.poster_path
                ? getImagePath(movie.poster_path)
                : "/placeholder-poster.png"
            }
            alt={movie.title}
            fill
            sizes="(max-width: 768px) 40vw, 20vw"
            className="object-cover"
          />

          <div className="absolute top-2 right-2 flex items-center gap-1 bg-background/80 backdrop-blur-sm rounded-full px-2 py-1 text-xs">
            <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
            <span>{movie.vote_average?.toFixed(1) || "N/A"}</span>
          </div>
        </div>

        <div className="p-2 flex-1 flex flex-col">
          <h3 className="font-medium line-clamp-1">{movie.title}</h3>
          <p className="text-xs text-muted-foreground">
            {movie.release_date?.split("-")[0] || "TBA"}
          </p>
        </div>
      </motion.div>
    </Link>
  );
}
