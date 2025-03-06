import { Suspense } from "react"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { fetchMovieDetails } from "@/lib/tmdb"
import { MovieCarousel } from "@/components/movie-carousel"
import { MovieDetailHero } from "@/components/movie-detail-hero"

interface MoviePageProps {
  params: {
    id: string
  }
}

export default async function MoviePage({ params }: MoviePageProps) {
  try {
    const movie = await fetchMovieDetails(params.id)

    return (
      <div className="flex flex-col min-h-screen">
        {/* Movie Hero */}
        <MovieDetailHero movie={movie} />

        <div className="container py-12 space-y-12">
          {/* Cast Section */}
          <section>
            <h2 className="text-2xl font-bold font-playfair mb-6">Cast</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {movie.credits.cast.slice(0, 12).map((person: any) => (
                <Link
                  key={person.id}
                  href={`/person/${person.id}`}
                  className="group rounded-lg overflow-hidden bg-card transition-transform hover:scale-105"
                >
                  <div className="aspect-[2/3] relative">
                    <Image
                      src={
                        person.profile_path
                          ? `https://image.tmdb.org/t/p/w500${person.profile_path}`
                          : "/placeholder.svg?height=300&width=200"
                      }
                      alt={person.name}
                      fill
                      sizes="(max-width: 768px) 50vw, 16vw"
                      className="object-cover"
                    />
                  </div>
                  <div className="p-2">
                    <h3 className="font-medium line-clamp-1 group-hover:text-accent transition-colors">
                      {person.name}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-1">{person.character}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* Videos Section */}
          {movie.videos && movie.videos.results && movie.videos.results.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold font-playfair mb-6">Videos</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {movie.videos.results.slice(0, 2).map((video: any) => (
                  <div key={video.id} className="aspect-video rounded-lg overflow-hidden">
                    <iframe
                      width="100%"
                      height="100%"
                      src={`https://www.youtube.com/embed/${video.key}`}
                      title={video.name}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Similar Movies */}
          <Suspense fallback={<div>Loading similar movies...</div>}>
            {movie.similar && movie.similar.results && movie.similar.results.length > 0 && (
              <MovieCarousel title="Similar Movies" movies={movie.similar.results} />
            )}
          </Suspense>
        </div>
      </div>
    )
  } catch (error) {
    console.error("Error fetching movie:", error)
    notFound()
  }
}

