"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { Movie, MovieDetails } from "@/types";
import { useToast } from "@/components/ui/use-toast";

interface MovieContextType {
  watchlist: Movie[];
  favorites: Movie[];
  recentlyViewed: Movie[];
  preferences: {
    genres: number[];
  };
  addToWatchlist: (movie: Movie) => void;
  removeFromWatchlist: (id: number) => void;
  clearWatchlist: () => void;
  isInWatchlist: (id: number) => boolean;
  addToFavorites: (movie: Movie) => void;
  removeFromFavorites: (id: number) => void;
  clearFavorites: () => void;
  isInFavorites: (id: number) => boolean;
  addToRecentlyViewed: (movie: Movie) => void;
  clearRecentlyViewed: () => void;
  updatePreferences: (genreIds: number[]) => void;
}

const MovieContext = createContext<MovieContextType | undefined>(undefined);

export function MovieProvider({ children }: { children: ReactNode }) {
  const [watchlist, setWatchlist] = useState<Movie[]>([]);
  const [favorites, setFavorites] = useState<Movie[]>([]);
  const [recentlyViewed, setRecentlyViewed] = useState<Movie[]>([]);
  const [preferences, setPreferences] = useState<{ genres: number[] }>({
    genres: [],
  });
  const { toast } = useToast();

  // Load data from localStorage on mount
  useEffect(() => {
    try {
      const storedWatchlist = localStorage.getItem("moxie-watchlist");
      const storedFavorites = localStorage.getItem("moxie-favorites");
      const storedRecentlyViewed = localStorage.getItem(
        "moxie-recently-viewed"
      );
      const storedPreferences = localStorage.getItem("moxie-preferences");

      if (storedWatchlist) setWatchlist(JSON.parse(storedWatchlist));
      if (storedFavorites) setFavorites(JSON.parse(storedFavorites));
      if (storedRecentlyViewed)
        setRecentlyViewed(JSON.parse(storedRecentlyViewed));
      if (storedPreferences) setPreferences(JSON.parse(storedPreferences));
    } catch (error) {
      console.error("Failed to load data from localStorage:", error);
      toast({
        title: "Error",
        description:
          "Failed to load your saved data. Your preferences may be reset.",
        variant: "destructive",
      });
    }
  }, [toast]);

  // Save data to localStorage when it changes
  useEffect(() => {
    try {
      localStorage.setItem("moxie-watchlist", JSON.stringify(watchlist));
      localStorage.setItem("moxie-favorites", JSON.stringify(favorites));
      localStorage.setItem(
        "moxie-recently-viewed",
        JSON.stringify(recentlyViewed)
      );
      localStorage.setItem("moxie-preferences", JSON.stringify(preferences));
    } catch (error) {
      console.error("Failed to save data to localStorage:", error);
    }
  }, [watchlist, favorites, recentlyViewed, preferences]);

  const addToWatchlist = (movie: Movie) => {
    if (!isInWatchlist(movie.id)) {
      setWatchlist((prev) => [movie, ...prev]);
    }
  };

  const removeFromWatchlist = (id: number) => {
    setWatchlist((prev) => prev.filter((movie) => movie.id !== id));
  };

  const clearWatchlist = () => {
    setWatchlist([]);
  };

  const isInWatchlist = (id: number) => {
    return watchlist.some((movie) => movie.id === id);
  };

  const addToFavorites = (movie: Movie) => {
    if (!isInFavorites(movie.id)) {
      setFavorites((prev) => [movie, ...prev]);
    }
  };

  const removeFromFavorites = (id: number) => {
    setFavorites((prev) => prev.filter((movie) => movie.id !== id));
  };

  const clearFavorites = () => {
    setFavorites([]);
  };

  const isInFavorites = (id: number) => {
    return favorites.some((movie) => movie.id === id);
  };

  const addToRecentlyViewed = (movie: Movie) => {
    setRecentlyViewed((prev) => {
      // Remove if already exists
      const filtered = prev.filter((m) => m.id !== movie.id);
      // Add to beginning and limit to 20 items
      return [movie, ...filtered].slice(0, 20);
    });
  };

  const clearRecentlyViewed = () => {
    setRecentlyViewed([]);
  };

  const updatePreferences = (genreIds: number[]) => {
    setPreferences((prev) => {
      const uniqueGenres = [...new Set([...prev.genres, ...genreIds])];
      return { ...prev, genres: uniqueGenres };
    });
  };

  return (
    <MovieContext.Provider
      value={{
        watchlist,
        favorites,
        recentlyViewed,
        preferences,
        addToWatchlist,
        removeFromWatchlist,
        clearWatchlist,
        isInWatchlist,
        addToFavorites,
        removeFromFavorites,
        clearFavorites,
        isInFavorites,
        addToRecentlyViewed,
        clearRecentlyViewed,
        updatePreferences,
      }}
    >
      {children}
    </MovieContext.Provider>
  );
}

export function useMovieContext() {
  const context = useContext(MovieContext);
  if (context === undefined) {
    throw new Error("useMovieContext must be used within a MovieProvider");
  }
  return context;
}
