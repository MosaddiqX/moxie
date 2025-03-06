'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import MovieGrid from '@/components/movie-grid'
import { useToast } from '@/components/ui/use-toast'
import { searchMovies } from '@/lib/api'
import { Movie } from '@/types'
import { useDebounce } from '@/hooks/use-debounce'

export default function SearchPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { toast } = useToast()

  const initialQuery = searchParams.get('q') || ''
  const [searchQuery, setSearchQuery] = useState(initialQuery)
  const [movies, setMovies] = useState<Movie[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)

  const debouncedQuery = useDebounce(searchQuery, 300)

  useEffect(() => {
    // Update URL with search query
    if (debouncedQuery) {
      router.push(`/search?q=${encodeURIComponent(debouncedQuery)}`)
    } else if (initialQuery) {
      router.push('/search')
    }

    const fetchSearchResults = async () => {
      if (!debouncedQuery) {
        setMovies([])
        setTotalPages(0)
        return
      }

      try {
        setIsLoading(true)
        const data = await searchMovies(debouncedQuery, 1)
        setMovies(data.results)
        setTotalPages(data.total_pages)
        setPage(1)
      } catch (error) {
        console.error('Failed to search movies:', error)
        toast({
          title: "Error",
          description: "Failed to search movies. Please try again later.",
          variant: "destructive"
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchSearchResults()

    // Scroll to top on search
    window.scrollTo(0, 0)
  }, [debouncedQuery, initialQuery, router, toast])

  const loadMoreResults = async () => {
    if (page >= totalPages) return

    try {
      setIsLoading(true)
      const nextPage = page + 1
      const data = await searchMovies(debouncedQuery, nextPage)
      setMovies(prev => [...prev, ...data.results])
      setPage(nextPage)
    } catch (error) {
      console.error('Failed to load more results:', error)
      toast({
        title: "Error",
        description: "Failed to load more results. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto px-4 py-8 min-h-screen"
    >
      <div className="max-w-3xl mx-auto mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-6 text-center">Search Movies</h1>

        <div className="relative">
          <Input
            type="text"
            placeholder="Search for movies..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-12 text-lg"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
        </div>
      </div>

      {debouncedQuery ? (
        <>
          <div className="mb-6">
            <h2 className="text-xl font-medium">
              {isLoading && !movies.length
                ? "Searching..."
                : `Results for "${debouncedQuery}"`}
            </h2>
          </div>
                : `Results for "${debouncedQuery}"`}
            </h2>
          </div>

          {movies.length === 0 && !isLoading ? (
            <div className="text-center py-16">
              <p className="text-xl text-muted-foreground">No results found for "{debouncedQuery}"</p>
              <p className="mt-2">Try a different search term or browse our categories</p>
            </div>
          ) : (
            <>
              <MovieGrid movies={movies} isLoading={isLoading} />

              {page < totalPages && (
                <div className="flex justify-center mt-8">
                  <Button
                    onClick={loadMoreResults}
                    disabled={isLoading}
                    size="lg"
                  >
                    {isLoading ? "Loading..." : "Load More"}
                  </Button>
                </div>
              )}
            </>
          )}
        </>
      ) : (
        <div className="text-center py-16">
          <p className="text-xl text-muted-foreground">Enter a search term to find movies</p>
        </div>
      )}
    </motion.div>
  )
}
