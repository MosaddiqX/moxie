"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Heart, Plus, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";
import MovieCarousel from "@/components/movie-carousel";
import { useMovieContext } from "@/context/movie-context";
import { getMovieDetails, getMovieCredits, getSimilarMovies } from "@/lib/api";
import { formatDate, getImagePath } from "@/lib/utils";
import { MovieDetails, Cast, Movie } from "@/types";

export default function MovieDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const {
    addToWatchlist,
    removeFromWatchlist,
    isInWatchlist,
    addToFavorites,
    removeFromFavorites,
    isInFavorites,
    addToRecentlyViewed,
    updatePreferences,
  } = useMovieContext();

  const [movie, setMovie] = useState<MovieDetails | null>(null);
  const [cast, setCast] = useState<Cast[]>([]);
  const [similarMovies, setSimilarMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      if (!id) return;

      try {
        setIsLoading(true);
        const [movieData, creditsData, similarData] = await Promise.all([
          getMovieDetails(id as string),
          getMovieCredits(id as string),
          getSimilarMovies(id as string),
        ]);

        setMovie(movieData);
        setCast(creditsData.cast.slice(0, 10));
        setSimilarMovies(similarData.results);

        // Add to recently viewed and update preferences
        if (movieData) {
          addToRecentlyViewed(movieData);
          updatePreferences(movieData.genres.map((g) => g.id));
        }
      } catch (error) {
        console.error("Failed to fetch movie details:", error);
        toast({
          title: "Error",
          description: "Failed to load movie details. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchMovieDetails();

    // Scroll to top on page load
    window.scrollTo(0, 0);
  }, [id, addToRecentlyViewed, updatePreferences, toast]);

  const handleWatchlistToggle = () => {
    if (!movie) return;

    if (isInWatchlist(movie.id)) {
      removeFromWatchlist(movie.id);
      toast({
        title: "Removed from Watchlist",
        description: `${movie.title} has been removed from your watchlist.`,
      });
    } else {
      addToWatchlist(movie);
      toast({
        title: "Added to Watchlist",
        description: `${movie.title} has been added to your watchlist.`,
      });
    }
  };

  const handleFavoritesToggle = () => {
    if (!movie) return;

    if (isInFavorites(movie.id)) {
      removeFromFavorites(movie.id);
      toast({
        title: "Removed from Favorites",
        description: `${movie.title} has been removed from your favorites.`,
      });
    } else {
      addToFavorites(movie);
      toast({
        title: "Added to Favorites",
        description: `${movie.title} has been added to your favorites.`,
      });
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          <Skeleton className="w-full md:w-1/3 aspect-[2/3] rounded-lg" />
          <div className="w-full md:w-2/3 space-y-4">
            <Skeleton className="h-12 w-3/4" />
            <Skeleton className="h-6 w-1/4" />
            <Skeleton className="h-6 w-1/3" />
            <div className="flex gap-2 py-2">
              <Skeleton className="h-10 w-24" />
              <Skeleton className="h-10 w-24" />
            </div>
            <Skeleton className="h-32 w-full" />
            <div className="space-y-2 pt-4">
              <Skeleton className="h-6 w-1/4" />
              <div className="flex gap-4 overflow-x-auto py-2">
                {[...Array(5)].map((_, i) => (
                  <Skeleton
                    key={i}
                    className="h-16 w-16 rounded-full flex-shrink-0"
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold">Movie not found</h1>
        <p className="mt-4">
          The movie you're looking for doesn't exist or has been removed.
        </p>
        <Button onClick={() => router.push("/")} className="mt-8">
          Back to Home
        </Button>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen pb-20"
    >
      {/* Backdrop */}
      <div className="relative w-full h-[50vh] md:h-[70vh]">
        <Image
          src={
            getImagePath(movie.backdrop_path, "original") || "/placeholder.svg"
          }
          alt={movie.title}
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
      </div>

      <div className="container mx-auto px-4 -mt-40 md:-mt-60 relative z-10">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Poster */}
          <div className="w-full md:w-1/3 lg:w-1/4">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="rounded-lg overflow-hidden shadow-xl"
            >
              <Image
                src={getImagePath(movie.poster_path) || "/placeholder.svg"}
                alt={movie.title}
                width={500}
                height={750}
                className="w-full h-auto"
              />
            </motion.div>
          </div>

          {/* Details */}
          <div className="w-full md:w-2/3 lg:w-3/4 space-y-6">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold">
                {movie.title}
              </h1>

              <div className="flex flex-wrap items-center gap-4 mt-3 text-muted-foreground">
                <span>{formatDate(movie.release_date)}</span>
                <span>•</span>
                <span>{movie.runtime} min</span>
                <span>•</span>
                <div className="flex items-center">
                  <Star className="w-5 h-5 text-yellow-500 mr-1 fill-yellow-500" />
                  <span>{movie.vote_average.toFixed(1)}</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mt-4">
                {movie.genres.map((genre) => (
                  <span
                    key={genre.id}
                    className="px-3 py-1 rounded-full text-sm bg-secondary text-secondary-foreground"
                  >
                    {genre.name}
                  </span>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex gap-3"
            >
              <Button
                onClick={handleWatchlistToggle}
                variant={isInWatchlist(movie.id) ? "secondary" : "default"}
                className="gap-2"
              >
                <Plus className="w-4 h-4" />
                {isInWatchlist(movie.id) ? "In Watchlist" : "Add to Watchlist"}
              </Button>

              <Button
                onClick={handleFavoritesToggle}
                variant="outline"
                className="gap-2"
              >
                <Heart
                  className={`w-4 h-4 ${
                    isInFavorites(movie.id)
                      ? "fill-destructive text-destructive"
                      : ""
                  }`}
                />
                {isInFavorites(movie.id) ? "Favorited" : "Add to Favorites"}
              </Button>
            </motion.div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <h2 className="text-xl font-semibold mb-2">Overview</h2>
              <p className="text-muted-foreground leading-relaxed">
                {movie.overview}
              </p>
            </motion.div>

            {/* Cast */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <h2 className="text-xl font-semibold mb-4">Cast</h2>
              <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin">
                {cast.map((person) => (
                  <Link
                    key={person.id}
                    href={`/person/${person.id}`}
                    className="flex-shrink-0 w-24 text-center group"
                  >
                    <div className="w-20 h-20 mx-auto rounded-full overflow-hidden mb-2 border-2 border-transparent group-hover:border-accent transition-all duration-300">
                      <Image
                        src={
                          person.profile_path
                            ? getImagePath(person.profile_path, "w185")
                            : "/placeholder-avatar.png"
                        }
                        alt={person.name}
                        width={80}
                        height={80}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <p className="text-sm truncate group-hover:text-accent transition-colors duration-300">
                      {person.name}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {person.character}
                    </p>
                  </Link>
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Similar Movies */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="mt-16"
        >
          <MovieCarousel
            title="Similar Movies"
            movies={similarMovies}
            isLoading={false}
          />
        </motion.div>
      </div>
    </motion.div>
  );
}
