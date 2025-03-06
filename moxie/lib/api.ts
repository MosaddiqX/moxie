// API functions for fetching movie data from TMDB

const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

// Helper function to make API requests
async function fetchFromTMDB(
  endpoint: string,
  params: Record<string, string> = {}
) {
  const queryParams = new URLSearchParams({
    api_key: API_KEY!,
    ...params,
  });

  const url = `${BASE_URL}${endpoint}?${queryParams}`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(
      `TMDB API error: ${response.status} ${response.statusText}`
    );
  }

  return response.json();
}

// Get popular movies
export function getPopularMovies(page = 1) {
  return fetchFromTMDB("/movie/popular", { page: page.toString() });
}

// Get trending movies
export function getTrendingMovies(timeWindow = "day", page = 1) {
  return fetchFromTMDB(`/trending/movie/${timeWindow}`, {
    page: page.toString(),
  });
}

// Get top rated movies
export function getTopRatedMovies(page = 1) {
  return fetchFromTMDB("/movie/top_rated", { page: page.toString() });
}

// Get movie details
export function getMovieDetails(id: string) {
  return fetchFromTMDB(`/movie/${id}`);
}

// Get movie credits (cast and crew)
export function getMovieCredits(id: string) {
  return fetchFromTMDB(`/movie/${id}/credits`);
}

// Get similar movies
export function getSimilarMovies(id: string, page = 1) {
  return fetchFromTMDB(`/movie/${id}/similar`, { page: page.toString() });
}

// Search movies
export function searchMovies(query: string, page = 1) {
  return fetchFromTMDB("/search/movie", {
    query,
    page: page.toString(),
    include_adult: "false",
  });
}

// Get person details
export function getPersonDetails(id: string) {
  return fetchFromTMDB(`/person/${id}`);
}

// Get person movie credits
export function getPersonMovieCredits(id: string) {
  return fetchFromTMDB(`/person/${id}/movie_credits`);
}

// Get movies by genre
export function getMoviesByGenre(genreId: number, page = 1) {
  return fetchFromTMDB("/discover/movie", {
    with_genres: genreId.toString(),
    page: page.toString(),
  });
}
