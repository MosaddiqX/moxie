"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { motion, useScroll, useTransform } from "framer-motion"
import { Award, Calendar, MapPin, Star, TrendingUp, Users } from "lucide-react"

interface PersonDetailHeroProps {
  person: any
}

export function PersonDetailHero({ person }: PersonDetailHeroProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  })

  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"])
  const imageOpacity = useTransform(scrollYProgress, [0, 0.8, 1], [1, 1, 0.6])
  const contentScale = useTransform(scrollYProgress, [0, 0.1], [1, 1.02])

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  // Calculate age
  const calculateAge = () => {
    if (!person.birthday) return null

    const birthDate = new Date(person.birthday)
    const today = person.deathday ? new Date(person.deathday) : new Date()

    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }

    return age
  }

  const age = calculateAge()

  // Get top movies
  const topMovies = person.movie_credits?.cast?.sort((a: any, b: any) => b.popularity - a.popularity)?.slice(0, 3) || []

  return (
    <div
      ref={containerRef}
      className="relative w-full bg-gradient-to-b from-background/50 to-background pt-32 pb-12 min-h-[140vh]"
    >
      <div className="container">
        <div className="grid md:grid-cols-[300px_1fr] gap-8 lg:gap-16">
          <motion.div
            ref={imageRef}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            style={{ y: imageY, opacity: imageOpacity }}
            className="rounded-lg overflow-hidden shadow-xl sticky top-32 self-start"
          >
            <div className="relative">
              <Image
                src={
                  person.profile_path
                    ? `https://image.tmdb.org/t/p/w500${person.profile_path}`
                    : "/placeholder.svg?height=450&width=300"
                }
                alt={person.name}
                width={300}
                height={450}
                className="w-full h-auto"
              />

              {/* Popularity indicator */}
              {person.popularity > 20 && (
                <div className="absolute top-4 right-4 bg-accent/90 text-accent-foreground rounded-full px-3 py-1 text-xs font-medium flex items-center gap-1 backdrop-blur-sm">
                  <TrendingUp className="h-3 w-3" />
                  <span>Popular</span>
                </div>
              )}

              {/* Image overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

              {/* Bottom info */}
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <h2 className="text-white text-xl font-bold font-playfair">{person.name}</h2>
                <p className="text-white/80 text-sm">{person.known_for_department}</p>
              </div>
            </div>

            {/* Quick stats */}
            <div className="bg-card p-4 border-t border-border/50">
              <div className="grid grid-cols-2 gap-3 text-sm">
                {person.birthday && (
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-accent" />
                    <span>{new Date(person.birthday).getFullYear()}</span>
                  </div>
                )}

                {age !== null && (
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">Age:</span>
                    <span>{person.deathday ? `${age} (deceased)` : age}</span>
                  </div>
                )}

                {person.place_of_birth && (
                  <div className="flex items-center gap-2 col-span-2">
                    <MapPin className="h-4 w-4 text-accent" />
                    <span className="truncate">{person.place_of_birth}</span>
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          <motion.div style={{ scale: contentScale }} className="origin-top">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-4xl md:text-5xl font-bold font-playfair mb-4 bg-gradient-to-r from-white to-white/80 dark:from-white dark:to-white/70 bg-clip-text text-transparent"
            >
              {person.name}
            </motion.h1>

            {/* Career highlights */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="mb-8 flex flex-wrap gap-3"
            >
              {person.known_for_department && (
                <span className="bg-accent/20 text-accent px-3 py-1 rounded-full text-sm font-medium">
                  {person.known_for_department}
                </span>
              )}

              {person.movie_credits?.cast?.length > 0 && (
                <span className="bg-secondary/50 px-3 py-1 rounded-full text-sm flex items-center gap-1">
                  <Users className="h-3.5 w-3.5" />
                  <span>{person.movie_credits.cast.length} Movies</span>
                </span>
              )}

              {person.popularity > 0 && (
                <span className="bg-secondary/50 px-3 py-1 rounded-full text-sm flex items-center gap-1">
                  <Star className="h-3.5 w-3.5" />
                  <span>Popularity: {person.popularity.toFixed(1)}</span>
                </span>
              )}
            </motion.div>

            {/* Biography */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="mb-10"
            >
              <h2 className="text-2xl font-bold mb-4 font-playfair">Biography</h2>
              <div className="prose prose-sm dark:prose-invert max-w-none">
                {person.biography ? (
                  person.biography.split("\n\n").map((paragraph: string, i: number) => (
                    <p key={i} className="text-muted-foreground mb-4 leading-relaxed">
                      {paragraph}
                    </p>
                  ))
                ) : (
                  <p className="text-muted-foreground italic">No biography available.</p>
                )}
              </div>
            </motion.div>

            {/* Career highlights */}
            {topMovies.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="mb-10"
              >
                <h2 className="text-2xl font-bold mb-4 font-playfair">Career Highlights</h2>
                <div className="grid gap-4">
                  {topMovies.map((movie: any, index: number) => (
                    <motion.div
                      key={movie.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.7 + index * 0.1 }}
                      className="flex gap-4 items-center bg-card/50 p-4 rounded-lg border border-border/50 hover:bg-card transition-colors"
                    >
                      <div className="relative h-16 w-12 flex-shrink-0 rounded overflow-hidden">
                        <Image
                          src={
                            movie.poster_path
                              ? `https://image.tmdb.org/t/p/w200${movie.poster_path}`
                              : "/placeholder.svg?height=96&width=64"
                          }
                          alt={movie.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium truncate">{movie.title}</h3>
                        <p className="text-sm text-muted-foreground truncate">
                          {movie.character ? `as ${movie.character}` : "Cast"}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-muted-foreground">
                            {movie.release_date ? new Date(movie.release_date).getFullYear() : "Unknown"}
                          </span>
                          {movie.vote_average > 0 && (
                            <div className="flex items-center gap-1 text-xs">
                              <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                              <span>{movie.vote_average.toFixed(1)}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Awards and recognition (placeholder) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }}
              transition={{ duration: 0.5, delay: 0.7 }}
              className="mb-10"
            >
              <h2 className="text-2xl font-bold mb-4 font-playfair flex items-center gap-2">
                <Award className="h-5 w-5 text-accent" />
                Awards & Recognition
              </h2>
              <p className="text-muted-foreground italic">
                Information about awards and recognition will be added soon.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

