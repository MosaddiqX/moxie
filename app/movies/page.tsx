"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Search, X, ChevronDown, SlidersHorizontal, TrendingUp, Award, Flame, Sparkles } from "lucide-react"
import { MovieCard } from "@/components/movie-card"
import { SkeletonCard } from "@/components/skeleton-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { fetchGenres, fetchMoviesByGenre, fetchPopular, fetchTopRated, fetchTrending, searchMovies } from "@/lib/tmdb"
import { useDebounce } from "@/hooks/use-debounce"

export default function MoviesPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const initialQuery = searchParams.get("q") || ""
  const initialGenre = searchParams.get("genre") || ""
  const initialTab = searchParams.get("tab") || "discover"

  const [query, setQuery] = useState(initialQuery)
  const [activeTab, setActiveTab] = useState(initialTab)
  const [results, setResults] = useState<any[]>([])
  const [popularMovies, setPopularMovies] = useState<any[]>([])
  const [trendingMovies, setTrendingMovies] = useState<any[]>([])
  const [topRatedMovies, setTopRatedMovies] = useState<any[]>([])
  const [genres, setGenres] = useState<any[]>([])
  const [selectedGenres, setSelectedGenres] = useState<string[]>(initialGenre ? [initialGenre] : [])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [totalResults, setTotalResults] = useState(0)
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [yearRange, setYearRange] = useState<[number, number]>([1900, new Date().getFullYear()])
  const [ratingRange, setRatingRange] = useState<[number, number]>([0, 10])
  const [includeAdult, setIncludeAdult] = useState(false)
  const [sortBy, setSortBy] = useState("popularity.desc")

  const debouncedQuery = useDebounce(query, 300)
  const observerRef = useRef<IntersectionObserver | null>(null)
  const loadMoreRef = useRef<HTMLDivElement>(null)

  // Update URL with search params
  const updateUrlParams = useCallback(() => {
    const params = new URLSearchParams()

    if (query) params.set("q", query)
    if (selectedGenres.length > 0) params.set("genre", selectedGenres[0])
    if (activeTab !== "discover") params.set("tab", activeTab)

    const newUrl = `${window.location.pathname}${params.toString() ? `?${params.toString()}` : ""}`
    router.replace(newUrl, { scroll: false })
  }, [query, selectedGenres, activeTab, router])

  // Fetch genres on mount
  useEffect(() => {
    const getGenres = async () => {
      try {
        const data = await fetchGenres()
        setGenres(data.genres)
      } catch (err) {
        console.error("Failed to fetch genres:", err)
      }
    }

    getGenres()
  }, [])

  // Fetch initial data based on active tab
  useEffect(() => {
    const fetchInitialData = async () => {
      setIsLoading(true)
      setError(null)

      try {
        let data

        switch (activeTab) {
          case "search":
            if (debouncedQuery) {
              data = await searchMovies(debouncedQuery)
              setResults(data.results || [])
              setTotalResults(data.total_results || 0)
              setHasMore(data.page < data.total_pages)
            } else {
              setResults([])
              setTotalResults(0)
              setHasMore(false)
            }
            break

          case "popular":
            data = await fetchPopular()
            setPopularMovies(data.results || [])
            setTotalResults(data.total_results || 0)
            setHasMore(data.page < data.total_pages)
            break

          case "trending":
            data = await fetchTrending()
            setTrendingMovies(data.results || [])
            setTotalResults(data.total_results || 0)
            setHasMore(data.page < data.total_pages)
            break

          case "top-rated":
            data = await fetchTopRated()
            setTopRatedMovies(data.results || [])
            setTotalResults(data.total_results || 0)
            setHasMore(data.page < data.total_pages)
            break

          default: // discover
            if (selectedGenres.length > 0) {
              data = await fetchMoviesByGenre(Number.parseInt(selectedGenres[0]))
              setResults(data.results || [])
              setTotalResults(data.total_results || 0)
              setHasMore(data.page < data.total_pages)
            } else {
              data = await fetchPopular()
              setResults(data.results || [])
              setTotalResults(data.total_results || 0)
              setHasMore(data.page < data.total_pages)
            }
        }
      } catch (err) {
        setError("Failed to fetch movies. Please try again.")
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchInitialData()
    updateUrlParams()

    // Reset page when tab changes
    setPage(1)
  }, [activeTab, debouncedQuery, selectedGenres, updateUrlParams])

  // Set up intersection observer for infinite loading
  useEffect(() => {
    if (observerRef.current) {
      observerRef.current.disconnect()
    }

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          loadMoreMovies()
        }
      },
      { threshold: 0.5 },
    )

    if (loadMoreRef.current) {
      observerRef.current.observe(loadMoreRef.current)
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [hasMore, isLoading])

  // Load more movies
  const loadMoreMovies = async () => {
    if (isLoading || !hasMore) return

    const nextPage = page + 1
    setIsLoading(true)

    try {
      let data

      switch (activeTab) {
        case "search":
          data = await searchMovies(debouncedQuery, nextPage)
          setResults((prev) => [...prev, ...(data.results || [])])
          break

        case "popular":
          data = await fetchPopular(nextPage)
          setPopularMovies((prev) => [...prev, ...(data.results || [])])
          break

        case "trending":
          data = await fetchTrending("week", nextPage)
          setTrendingMovies((prev) => [...prev, ...(data.results || [])])
          break

        case "top-rated":
          data = await fetchTopRated(nextPage)
          setTopRatedMovies((prev) => [...prev, ...(data.results || [])])
          break

        default: // discover
          if (selectedGenres.length > 0) {
            data = await fetchMoviesByGenre(Number.parseInt(selectedGenres[0]), nextPage)
            setResults((prev) => [...prev, ...(data.results || [])])
          } else {
            data = await fetchPopular(nextPage)
            setResults((prev) => [...prev, ...(data.results || [])])
          }
      }

      setHasMore(data.page < data.total_pages)
      setPage(nextPage)
    } catch (err) {
      console.error("Failed to load more movies:", err)
    } finally {
      setIsLoading(false)
    }
  }

  // Handle tab change
  const handleTabChange = (value: string) => {
    setActiveTab(value)
    setPage(1)

    if (value === "search") {
      setQuery(initialQuery)
    } else {
      setQuery("")
    }
  }

  // Handle genre selection
  const handleGenreSelect = (genreId: string) => {
    if (selectedGenres.includes(genreId)) {
      setSelectedGenres(selectedGenres.filter((id) => id !== genreId))
    } else {
      setSelectedGenres([genreId]) // Only allow one genre for now
    }

    setPage(1)
  }

  // Get current movies based on active tab
  const getCurrentMovies = () => {
    switch (activeTab) {
      case "popular":
        return popularMovies
      case "trending":
        return trendingMovies
      case "top-rated":
        return topRatedMovies
      case "search":
      default:
        return results
    }
  }

  const currentMovies = getCurrentMovies()

  return (
    <div className="container py-24 min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-bold font-playfair mb-2">Explore Movies</h1>
        <p className="text-muted-foreground">Discover new films, search for your favorites, and filter by genre</p>
      </motion.div>

      <div className="mb-8">
        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <TabsList className="bg-background border border-input">
              <TabsTrigger
                value="discover"
                className="data-[state=active]:bg-accent data-[state=active]:text-accent-foreground"
              >
                <Sparkles className="h-4 w-4 mr-2" />
                Discover
              </TabsTrigger>
              <TabsTrigger
                value="trending"
                className="data-[state=active]:bg-accent data-[state=active]:text-accent-foreground"
              >
                <TrendingUp className="h-4 w-4 mr-2" />
                Trending
              </TabsTrigger>
              <TabsTrigger
                value="popular"
                className="data-[state=active]:bg-accent data-[state=active]:text-accent-foreground"
              >
                <Flame className="h-4 w-4 mr-2" />
                Popular
              </TabsTrigger>
              <TabsTrigger
                value="top-rated"
                className="data-[state=active]:bg-accent data-[state=active]:text-accent-foreground"
              >
                <Award className="h-4 w-4 mr-2" />
                Top Rated
              </TabsTrigger>
              <TabsTrigger
                value="search"
                className="data-[state=active]:bg-accent data-[state=active]:text-accent-foreground"
              >
                <Search className="h-4 w-4 mr-2" />
                Search
              </TabsTrigger>
            </TabsList>

            <div className="flex items-center gap-2">
              <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="gap-2">
                    <SlidersHorizontal className="h-4 w-4" />
                    Filters
                    {(selectedGenres.length > 0 || sortBy !== "popularity.desc") && (
                      <Badge className="ml-1 h-5 w-5 p-0 flex items-center justify-center">
                        {selectedGenres.length + (sortBy !== "popularity.desc" ? 1 : 0)}
                      </Badge>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80 p-0" align="end">
                  <div className="p-4 border-b">
                    <h3 className="font-medium">Filter Movies</h3>
                    <p className="text-sm text-muted-foreground">Refine your movie search</p>
                  </div>

                  <div className="p-4 space-y-4">
                    <div className="space-y-2">
                      <Label>Sort By</Label>
                      <Select value={sortBy} onValueChange={setSortBy}>
                        <SelectTrigger>
                          <SelectValue placeholder="Sort by..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="popularity.desc">Popularity (High to Low)</SelectItem>
                          <SelectItem value="popularity.asc">Popularity (Low to High)</SelectItem>
                          <SelectItem value="vote_average.desc">Rating (High to Low)</SelectItem>
                          <SelectItem value="vote_average.asc">Rating (Low to High)</SelectItem>
                          <SelectItem value="release_date.desc">Release Date (Newest)</SelectItem>
                          <SelectItem value="release_date.asc">Release Date (Oldest)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Year Range</Label>
                      <div className="flex items-center justify-between text-sm mb-2">
                        <span>{yearRange[0]}</span>
                        <span>{yearRange[1]}</span>
                      </div>
                      <Slider
                        value={yearRange}
                        min={1900}
                        max={new Date().getFullYear()}
                        step={1}
                        onValueChange={(value) => setYearRange(value as [number, number])}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Rating Range</Label>
                      <div className="flex items-center justify-between text-sm mb-2">
                        <span>{ratingRange[0]}</span>
                        <span>{ratingRange[1]}</span>
                      </div>
                      <Slider
                        value={ratingRange}
                        min={0}
                        max={10}
                        step={0.5}
                        onValueChange={(value) => setRatingRange(value as [number, number])}
                      />
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch id="include-adult" checked={includeAdult} onCheckedChange={setIncludeAdult} />
                      <Label htmlFor="include-adult">Include Adult Content</Label>
                    </div>
                  </div>

                  <div className="p-4 border-t flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setYearRange([1900, new Date().getFullYear()])
                        setRatingRange([0, 10])
                        setIncludeAdult(false)
                        setSortBy("popularity.desc")
                        setSelectedGenres([])
                      }}
                    >
                      Reset
                    </Button>
                    <Button size="sm" onClick={() => setIsFilterOpen(false)}>
                      Apply Filters
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>

              {totalResults > 0 && (
                <p className="text-sm text-muted-foreground">{totalResults.toLocaleString()} results</p>
              )}
            </div>
          </div>

          <TabsContent value="search" className="mt-0">
            <div className="relative max-w-2xl mb-8">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search for movies..."
                className="pl-10 h-12 text-lg"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              {query && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8"
                  onClick={() => setQuery("")}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </TabsContent>

          <TabsContent value="discover" className="mt-0">
            <div className="mb-8 overflow-x-auto pb-2">
              <div className="flex gap-2 min-w-max">
                {genres.map((genre) => (
                  <Button
                    key={genre.id}
                    variant={selectedGenres.includes(genre.id.toString()) ? "accent" : "outline"}
                    size="sm"
                    className="rounded-full"
                    onClick={() => handleGenreSelect(genre.id.toString())}
                  >
                    {genre.name}
                  </Button>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {isLoading && currentMovies.length === 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
          {Array(12)
            .fill(0)
            .map((_, i) => (
              <SkeletonCard key={i} />
            ))}
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <p className="text-destructive">{error}</p>
        </div>
      ) : currentMovies.length > 0 ? (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            <AnimatePresence mode="popLayout">
              {currentMovies.map((movie, index) => (
                <motion.div
                  key={`${movie.id}-${index}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3, delay: (index % 12) * 0.05 }}
                  layout
                >
                  <MovieCard
                    id={movie.id}
                    title={movie.title}
                    posterPath={movie.poster_path}
                    rating={movie.vote_average}
                    releaseDate={movie.release_date || "Unknown"}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {hasMore && (
            <div ref={loadMoreRef} className="flex justify-center mt-12">
              <Button variant="outline" size="lg" className="gap-2" onClick={loadMoreMovies} disabled={isLoading}>
                {isLoading ? (
                  <>
                    <div className="h-4 w-4 rounded-full border-2 border-current border-r-transparent animate-spin" />
                    Loading...
                  </>
                ) : (
                  <>
                    <ChevronDown className="h-4 w-4" />
                    Load More
                  </>
                )}
              </Button>
            </div>
          )}
        </>
      ) : activeTab === "search" && debouncedQuery ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-lg">No results found for "{debouncedQuery}"</p>
        </div>
      ) : activeTab === "search" ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-lg">Start typing to search for movies</p>
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-lg">No movies found</p>
        </div>
      )}
    </div>
  )
}

