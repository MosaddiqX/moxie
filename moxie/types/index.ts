// Movie types
export interface Movie {
  id: number;
  title: string;
  poster_path: string;
  backdrop_path?: string;
  overview: string;
  release_date: string;
  vote_average: number;
  vote_count: number;
  popularity: number;
  genre_ids: number[];
}

export interface MovieDetails extends Movie {
  genres: Genre[];
  runtime: number;
  status: string;
  tagline: string;
  budget: number;
  revenue: number;
  imdb_id: string;
  homepage: string;
  production_companies: ProductionCompany[];
}

export interface Genre {
  id: number;
  name: string;
}

export interface ProductionCompany {
  id: number;
  logo_path: string | null;
  name: string;
  origin_country: string;
}

// Person types
export interface Cast {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
  order: number;
}

export interface Crew {
  id: number;
  name: string;
  job: string;
  department: string;
  profile_path: string | null;
}

export interface PersonDetails {
  id: number;
  name: string;
  profile_path: string | null;
  biography: string;
  birthday: string | null;
  deathday: string | null;
  place_of_birth: string | null;
  known_for_department: string;
  popularity: number;
}

export interface MovieCredit {
  id: number;
  title: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  character?: string;
  job?: string;
  popularity: number;
}

// API response types
export interface ApiResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

export interface CreditsResponse {
  id: number;
  cast: Cast[];
  crew: Crew[];
}

export interface PersonMovieCreditsResponse {
  id: number;
  cast: MovieCredit[];
  crew: MovieCredit[];
}
