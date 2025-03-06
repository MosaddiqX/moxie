"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import MovieCarousel from "@/components/movie-carousel";
import HeroSection from "@/components/hero-section";
import MovieSection from "@/components/movie-section";
import { useMovieContext } from "@/context/movie-context";
import {
  getPopularMovies,
  getTopRatedMovies,
  getTrendingMovies,
} from "@/lib/api";
import { Movie } from "@/types";
import { useToast } from "@/components/ui/use-toast";

export default function Home() {
  const [popularMovies, setPopularMovies] = useState<Movie[]>([]);
  const [trendingMovies, setTrendingMovies] = useState<Movie[]>([]);
  const [topRatedMovies, setTopRatedMovies] = useState<Movie[]>([]);
  const [recommendedMovies, setRecommendedMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { recentlyViewed, preferences } = useMovieContext();
  const { toast } = useToast();

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setIsLoading(true);
        const [popular, trending, topRated] = await Promise.all([
          getPopularMovies(),
          getTrendingMovies(),
          getTopRatedMovies(),
        ]);

        setPopularMovies(popular.results);
        setTrendingMovies(trending.results);
        setTopRatedMovies(topRated.results);

        // Create personalized recommendations based on user preferences
        if (preferences.genres.length > 0) {
          // In a real app, we would use the preferences to fetch recommended movies
          // For now, we'll just filter the popular movies based on genre preferences
          const recommended = popular.results.filter((movie) =>
            movie.genre_ids.some((id) => preferences.genres.includes(id))
          );
          setRecommendedMovies(
            recommended.length > 0 ? recommended : popular.results.slice(0, 8)
          );
        } else {
          setRecommendedMovies(popular.results.slice(0, 8));
        }
      } catch (error) {
        console.error("Failed to fetch movies:", error);
        toast({
          title: "Error",
          description: "Failed to fetch movies. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchMovies();

    // Scroll to top on page load
    window.scrollTo(0, 0);
  }, [preferences.genres, toast]);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={container}
      className="min-h-screen pb-20"
    >
      <HeroSection movie={trendingMovies[0]} isLoading={isLoading} />

      <div className="container mx-auto px-4 space-y-16 mt-8">
        <MovieCarousel
          title="Trending Now"
          movies={trendingMovies}
          isLoading={isLoading}
        />

        <MovieSection
          title="Popular Movies"
          movies={popularMovies}
          isLoading={isLoading}
        />

        {recentlyViewed.length > 0 && (
          <MovieSection
            title="Recently Viewed"
            movies={recentlyViewed}
            isLoading={false}
          />
        )}

        <MovieSection
          title="Movies You'll Love"
          movies={recommendedMovies}
          isLoading={isLoading}
        />

        <MovieSection
          title="Top Rated"
          movies={topRatedMovies}
          isLoading={isLoading}
        />
      </div>
    </motion.div>
  );
}
