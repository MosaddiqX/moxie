"use client";

import { useState, useEffect } from "react";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { fetchMoviesByGenre, fetchMovieDetails } from "@/lib/tmdb";

interface ViewedMovie {
  id: number;
  title: string;
  posterPath: string;
  rating: number;
  releaseDate: string;
  viewedAt: string;
  genreIds?: number[];
}

export function useRecommendations() {
  const [recentlyViewed] = useLocalStorage<ViewedMovie[]>(
    "recently-viewed",
    []
  );
  const [favorites] = useLocalStorage<ViewedMovie[]>("favorites", []);
  const [watchlist] = useLocalStorage<ViewedMovie[]>("watchlist", []);
  const [recommendedMovies, setRecommendedMovies] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasEnoughData, setHasEnoughData] = useState(false);

  useEffect(() => {
    // Check if we have enough data to make recommendations
    const totalInteractions =
      recentlyViewed.length + favorites.length + watchlist.length;
    setHasEnoughData(totalInteractions >= 5);

    const generateRecommendations = async () => {
      if (totalInteractions < 5) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);

        // Create a weighted scoring system for genres
        const genreScores: Record<number, number> = {};

        // Add genre IDs from recently viewed with recency bias
        recentlyViewed.forEach((movie, index) => {
          if (movie.genreIds) {
            // More recent views get higher weight
            const recencyWeight =
              1 + (recentlyViewed.length - index) / recentlyViewed.length;

            movie.genreIds.forEach((genreId) => {
              genreScores[genreId] =
                (genreScores[genreId] || 0) + 1 * recencyWeight;
            });
          }
        });

        // Add genre IDs from favorites with higher weight (2x)
        for (const movie of favorites) {
          if (movie.genreIds) {
            movie.genreIds.forEach((genreId) => {
              genreScores[genreId] = (genreScores[genreId] || 0) + 2;
            });
          } else if (movie.id) {
            // If we don't have genre IDs, fetch them
            try {
              const movieDetails = await fetchMovieDetails(movie.id.toString());
              const genreIds = movieDetails.genres.map((g: any) => g.id);

              genreIds.forEach((genreId) => {
                genreScores[genreId] = (genreScores[genreId] || 0) + 2;
              });
            } catch (error) {
              console.error("Error fetching movie details:", error);
            }
          }
        }

        // Add genre IDs from watchlist with medium weight (1.5x)
        watchlist.forEach((movie) => {
          if (movie.genreIds) {
            movie.genreIds.forEach((genreId) => {
              genreScores[genreId] = (genreScores[genreId] || 0) + 1.5;
            });
          }
        });

        // Sort genres by score
        const sortedGenres = Object.entries(genreScores)
          .sort(([, scoreA], [, scoreB]) => scoreB - scoreA)
          .map(([genreId]) => Number.parseInt(genreId));

        // If we have genre data, fetch movies from the top 2 genres and mix them
        if (sortedGenres.length > 0) {
          const recommendations = [];

          // Get movies from top genre
          if (sortedGenres[0]) {
            const topGenreMovies = await fetchMoviesByGenre(sortedGenres[0]);
            recommendations.push(...(topGenreMovies.results || []));
          }

          // Get movies from second genre if available
          if (sortedGenres[1]) {
            const secondGenreMovies = await fetchMoviesByGenre(sortedGenres[1]);
            recommendations.push(...(secondGenreMovies.results || []));
          }

          // Remove duplicates and movies the user has already interacted with
          const interactedMovieIds = new Set([
            ...recentlyViewed.map((m) => m.id),
            ...favorites.map((m) => m.id),
            ...watchlist.map((m) => m.id),
          ]);

          const filteredRecommendations = recommendations
            .filter(
              (movie, index, self) =>
                // Remove duplicates
                index === self.findIndex((m) => m.id === movie.id) &&
                // Remove already interacted movies
                !interactedMovieIds.has(movie.id)
            )
            // Sort by popularity
            .sort((a, b) => b.popularity - a.popularity)
            .slice(0, 12);

          setRecommendedMovies(filteredRecommendations);
        } else {
          // Fallback: use movie IDs from interactions to simulate recommendations
          setRecommendedMovies(
            [...recentlyViewed, ...favorites, ...watchlist]
              .filter(
                (movie, index, self) =>
                  index === self.findIndex((m) => m.id === movie.id)
              )
              .slice(0, 12)
          );
        }
      } catch (error) {
        console.error("Error generating recommendations:", error);
      } finally {
        setIsLoading(false);
      }
    };

    generateRecommendations();
  }, [recentlyViewed, favorites, watchlist]);

  return {
    recommendedMovies,
    isLoading,
    hasEnoughData,
  };
}
