const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY
const BASE_URL = "https://api.themoviedb.org/3"

export async function fetchTrending(timeWindow: "day" | "week" = "week", page = 1) {
  const response = await fetch(
    `${BASE_URL}/trending/movie/${timeWindow}?api_key=${API_KEY}&language=en-US&page=${page}`,
  )

  if (!response.ok) {
    throw new Error("Failed to fetch trending movies")
  }

  return response.json()
}

export async function fetchPopular(page = 1) {
  const response = await fetch(`${BASE_URL}/movie/popular?api_key=${API_KEY}&language=en-US&page=${page}`)

  if (!response.ok) {
    throw new Error("Failed to fetch popular movies")
  }

  return response.json()
}

export async function fetchTopRated(page = 1) {
  const response = await fetch(`${BASE_URL}/movie/top_rated?api_key=${API_KEY}&language=en-US&page=${page}`)

  if (!response.ok) {
    throw new Error("Failed to fetch top rated movies")
  }

  return response.json()
}

export async function fetchUpcoming(page = 1) {
  const response = await fetch(`${BASE_URL}/movie/upcoming?api_key=${API_KEY}&language=en-US&page=${page}`)

  if (!response.ok) {
    throw new Error("Failed to fetch upcoming movies")
  }

  return response.json()
}

export async function fetchMovieDetails(id: string) {
  const response = await fetch(
    `${BASE_URL}/movie/${id}?api_key=${API_KEY}&language=en-US&append_to_response=credits,videos,similar,recommendations`,
  )

  if (!response.ok) {
    throw new Error(`Failed to fetch movie details for ID: ${id}`)
  }

  return response.json()
}

export async function fetchPersonDetails(id: string) {
  const response = await fetch(
    `${BASE_URL}/person/${id}?api_key=${API_KEY}&language=en-US&append_to_response=movie_credits`,
  )

  if (!response.ok) {
    throw new Error(`Failed to fetch person details for ID: ${id}`)
  }

  return response.json()
}

export async function searchMovies(query: string, page = 1) {
  if (!query) return { results: [] }

  const response = await fetch(
    `${BASE_URL}/search/movie?api_key=${API_KEY}&language=en-US&query=${encodeURIComponent(query)}&include_adult=false&page=${page}`,
  )

  if (!response.ok) {
    throw new Error("Failed to search movies")
  }

  return response.json()
}

export async function fetchMoviesByGenre(genreId: number, page = 1) {
  const response = await fetch(
    `${BASE_URL}/discover/movie?api_key=${API_KEY}&language=en-US&with_genres=${genreId}&sort_by=popularity.desc&page=${page}`,
  )

  if (!response.ok) {
    throw new Error(`Failed to fetch movies for genre ID: ${genreId}`)
  }

  return response.json()
}

export async function fetchGenres() {
  const response = await fetch(`${BASE_URL}/genre/movie/list?api_key=${API_KEY}&language=en-US`)

  if (!response.ok) {
    throw new Error("Failed to fetch genres")
  }

  return response.json()
}

export async function fetchMoviesByFilter(options: {
  sortBy?: string
  page?: number
  withGenres?: string
  year?: number
  voteAverageGte?: number
  voteAverageLte?: number
  includeAdult?: boolean
}) {
  const {
    sortBy = "popularity.desc",
    page = 1,
    withGenres = "",
    year,
    voteAverageGte,
    voteAverageLte,
    includeAdult = false,
  } = options

  let url = `${BASE_URL}/discover/movie?api_key=${API_KEY}&language=en-US&sort_by=${sortBy}&page=${page}&include_adult=${includeAdult}`

  if (withGenres) {
    url += `&with_genres=${withGenres}`
  }

  if (year) {
    url += `&primary_release_year=${year}`
  }

  if (voteAverageGte !== undefined) {
    url += `&vote_average.gte=${voteAverageGte}`
  }

  if (voteAverageLte !== undefined) {
    url += `&vote_average.lte=${voteAverageLte}`
  }

  const response = await fetch(url)

  if (!response.ok) {
    throw new Error("Failed to fetch filtered movies")
  }

  return response.json()
}

