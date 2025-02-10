import { useEffect, useState } from "react";
import { useDebounce } from "react-use";
import Search from "./components/Search";
import Spinner from "./components/Spinner";
import MovieCard from "./components/MovieCard";
import ODMB from "./components/ODMB";
import { getTrendingMovies, updateSearchCount } from "./appwrite.js";

const API_BASE_URL = "https://movie-database-api1.p.rapidapi.com";
const OMDB_API_BASE_URL = "https://www.omdbapi.com";
// /

const API_KEY = import.meta.env.VITE_MDB_API_KEY;
const OMDB_API_KEY = import.meta.env.VITE_OMDB_API_KEY;

const API_OPTIONS = {
  method: "GET",
  headers: {
    "x-rapidapi-key": API_KEY,
    "x-rapidapi-host": "movie-database-api1.p.rapidapi.com",
  },
};

const App = () => {
  const [apiSource, setApiSource] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const [movieList, setMovieList] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [trendingMovies, setTrendingMovies] = useState([]);

  // Imporved the Search function using debounce npm
  useDebounce(() => setDebouncedSearchTerm(searchTerm), 500, [searchTerm]);

  const fetchMovies = async (query = "") => {
    setIsLoading(true);
    setErrorMessage("");

    try {
      if (!query) {
        // MDB API flow
        setApiSource("MDB");
        const endpoint = `${API_BASE_URL}/list_movies.json?limit=20&sort_by=like_count&order_by=desc&with_rt_ratings=true`;

        const response = await fetch(endpoint, API_OPTIONS);
        if (!response.ok) {
          throw new Error("Failed to fetch Movies");
        }

        const data = await response.json();
        const movieData = data.data;

        if (!movieData || !movieData.movies) {
          setErrorMessage("No movies found.");
          setMovieList([]);
          return;
        }

        setMovieList(movieData.movies || []);
      } else {
        // OMDB API flow
        setApiSource("OMDB");
        const endpoint = `${OMDB_API_BASE_URL}/?apikey=${OMDB_API_KEY}&s=${query}`;

        const response = await fetch(endpoint);
        if (!response.ok) {
          throw new Error("Failed to fetch Movies");
        }

        const data = await response.json();
        const movieData = data.Search;
        if (!data || !data.Search) {
          setErrorMessage("No movies found.");
          setMovieList([]);
          return;
        }

        // Fetch detailed information for each movie
        try {
          const detailedMovies = await Promise.all(
            movieData.map(async (movie) => {
              const detailEndpoint = `${OMDB_API_BASE_URL}/?apikey=${OMDB_API_KEY}&t=${encodeURIComponent(
                movie.Title
              )}`;
              const detailResponse = await fetch(detailEndpoint);

              if (!detailResponse.ok) {
                throw new Error(
                  `Failed to fetch details for movie: ${movie.Title}`
                );
              }

              return await detailResponse.json();
            })
          );

          setMovieList(detailedMovies || []);

          if (detailedMovies.length > 0) {
            await updateSearchCount(query, detailedMovies[0]);
          }
        } catch (detailError) {
          console.error("Error fetching movie details: ", detailError);
          setErrorMessage(
            "Error fetching movie details. Please try again later."
          );
        }
      }
    } catch (error) {
      console.error("Error fetching movies: ", error);
      setErrorMessage("Error fetching movies. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const loadTrendingMovies = async () => {
    try {
      const movies = await getTrendingMovies();

      setTrendingMovies(movies);
    } catch (error) {
      console.error(`Error fetching trending Movies: ${error}`);
    }
  };

  useEffect(() => {
    fetchMovies(debouncedSearchTerm);
  }, [debouncedSearchTerm]);

  useEffect(() => {
    loadTrendingMovies();
  }, []);

  return (
    <main>
      <div className="pattern">
        <div className="wrapper">
          <header>
            <h1>
              <img src="./hero.png" alt="Hero Banner" />
              Find <span className="text-gradient">Movies</span> You&apos;ll
              Enjoy without the husttle
            </h1>
            <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
          </header>

          {trendingMovies.length > 0 && (
            <section className="trending">
              <h2>Trending Movies</h2>

              <ul>
                {trendingMovies.map((movie, index) => (
                  <li key={movie.$id}>
                    <p>{index + 1}</p>
                    <img src={movie.poster_url} alt={movie.title} />
                  </li>
                ))}
              </ul>
            </section>
          )}
          <section className="all-movies">
            <h2 className="">All Movies</h2>
            {isLoading ? (
              <Spinner />
            ) : errorMessage ? (
              <p className="text-red-500">{errorMessage}</p>
            ) : (
              <ul>
                {movieList.map((movie) =>
                  apiSource === "MDB" ? (
                    <MovieCard key={Math.random()} movie={movie} />
                  ) : (
                    <ODMB key={Math.random()} movie={movie} />
                  )
                )}
              </ul>
            )}
          </section>
        </div>
      </div>
    </main>
  );
};

export default App;
