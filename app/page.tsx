import { Suspense } from "react"
import { HeroSection } from "@/components/hero-section"
import { MovieCarousel } from "@/components/movie-carousel"
import { SkeletonCard } from "@/components/skeleton-card"
import { RecommendedMovies } from "@/components/recommended-movies"
import { fetchTrending, fetchPopular, fetchTopRated, fetchUpcoming, fetchGenres } from "@/lib/tmdb"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default async function Home() {
  // Fetch data in parallel
  const [trendingData, popularData, topRatedData, upcomingData, genresData] = await Promise.all([
    fetchTrending(),
    fetchPopular(),
    fetchTopRated(),
    fetchUpcoming(),
    fetchGenres(),
  ])

  // Add genre data to trending movies for the hero section
  const trendingWithGenres = trendingData.results.slice(0, 5).map((movie: any) => {
    // Get random genres for the hero (in a real app, we'd fetch the actual genres)
    const randomGenres = []
    const genresCopy = [...genresData.genres]

    for (let i = 0; i < 3; i++) {
      if (genresCopy.length === 0) break
      const randomIndex = Math.floor(Math.random() * genresCopy.length)
      randomGenres.push(genresCopy[randomIndex])
      genresCopy.splice(randomIndex, 1)
    }

    return {
      ...movie,
      genres: randomGenres,
    }
  })

  return (
    <div className="flex flex-col min-h-screen">
      <Suspense fallback={<HeroSkeleton />}>
        <HeroSection movies={trendingWithGenres} />
      </Suspense>

      <div className="container py-12 space-y-16">
        <Suspense fallback={<CarouselSkeleton title="Trending Now" />}>
          <MovieCarousel title="Trending Now" movies={trendingData.results} />
        </Suspense>

        {/* Personalized Recommendations Section */}
        <RecommendedMovies />

        <Suspense fallback={<CarouselSkeleton title="Popular Movies" />}>
          <MovieCarousel title="Popular Movies" movies={popularData.results} />
        </Suspense>

        <Suspense fallback={<CarouselSkeleton title="Top Rated" />}>
          <MovieCarousel title="Top Rated" movies={topRatedData.results} />
        </Suspense>

        <Suspense fallback={<CarouselSkeleton title="Coming Soon" />}>
          <MovieCarousel title="Coming Soon" movies={upcomingData.results} />
        </Suspense>

        <div className="flex flex-col items-center justify-center py-8 text-center">
          <h2 className="text-2xl font-bold font-playfair mb-4">Discover More Movies</h2>
          <p className="text-muted-foreground max-w-2xl mb-6">
            Explore our extensive collection of movies, filter by genre, search for your favorites, and create your
            personalized watchlist.
          </p>
          <Button asChild size="lg" className="rounded-full">
            <Link href="/movies">Explore All Movies</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

function HeroSkeleton() {
  return (
    <div className="relative min-h-[70vh] md:min-h-[80vh] w-full bg-muted animate-pulse">
      <div className="container relative flex flex-col justify-end h-full pb-16 pt-32">
        <div className="max-w-3xl space-y-4 mt-auto">
          <div className="h-8 bg-muted-foreground/20 rounded w-1/4" />
          <div className="h-12 bg-muted-foreground/20 rounded w-3/4" />
          <div className="h-4 bg-muted-foreground/20 rounded w-full" />
          <div className="h-4 bg-muted-foreground/20 rounded w-full" />
          <div className="h-4 bg-muted-foreground/20 rounded w-2/3" />
          <div className="flex gap-4 pt-4">
            <div className="h-10 bg-muted-foreground/20 rounded-full w-32" />
            <div className="h-10 bg-muted-foreground/20 rounded-full w-32" />
          </div>
        </div>
      </div>
    </div>
  )
}

function CarouselSkeleton({ title }: { title: string }) {
  return (
    <div>
      <h2 className="text-2xl font-bold font-playfair mb-4">{title}</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {Array(6)
          .fill(0)
          .map((_, i) => (
            <SkeletonCard key={i} className="min-w-[180px]" />
          ))}
      </div>
    </div>
  )
}

