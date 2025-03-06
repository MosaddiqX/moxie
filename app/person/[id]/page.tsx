import { Suspense } from "react"
import { notFound } from "next/navigation"
import { fetchPersonDetails } from "@/lib/tmdb"
import { MovieCard } from "@/components/movie-card"
import { PersonDetailHero } from "@/components/person-detail-hero"

interface PersonPageProps {
  params: {
    id: string
  }
}

export default async function PersonPage({ params }: PersonPageProps) {
  try {
    const person = await fetchPersonDetails(params.id)

    // Sort credits by popularity
    const sortedMovies = person.movie_credits.cast.sort((a: any, b: any) => b.popularity - a.popularity).slice(0, 12)

    return (
      <div className="flex flex-col min-h-screen">
        <PersonDetailHero person={person} />

        <div className="container py-12">
          <section>
            <h2 className="text-2xl font-bold font-playfair mb-6">Known For</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
              <Suspense fallback={<div>Loading movies...</div>}>
                {sortedMovies.map((movie: any) => (
                  <MovieCard
                    key={movie.id}
                    id={movie.id}
                    title={movie.title}
                    posterPath={movie.poster_path}
                    rating={movie.vote_average}
                    releaseDate={movie.release_date || "Unknown"}
                  />
                ))}
              </Suspense>
            </div>
          </section>
        </div>
      </div>
    )
  } catch (error) {
    console.error("Error fetching person:", error)
    notFound()
  }
}

