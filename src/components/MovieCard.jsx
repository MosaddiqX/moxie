const OMDB_API_KEY = import.meta.env.VITE_OMDB_API_KEY;

// eslint-disable-next-line react/prop-types
const MovieCard = ({ movie: { title, rating, year, language, imdb_code } }) => {
  return (
    <div className="movie-card">
      <img
        src={
          imdb_code
            ? `https://img.omdbapi.com/?apikey=${OMDB_API_KEY}&i=${imdb_code}`
            : "/no-movie.png"
        }
        alt={title}
      />

      <div className="mt-4">
        <h3>{title}</h3>

        <div className="content">
          <div className="rating">
            <img src="star.svg" alt="Star Icon" />
            <p>{rating ? rating : "N/A"} </p>
          </div>

          <span>•</span>
          <p className="lang">{language}</p>
          <span>•</span>
          <p className="year">{year ? year : "N/A"}</p>
        </div>
      </div>
    </div>
  );
};

// http://img.omdbapi.com/?apikey=eb5161f5&i=tt4154796
export default MovieCard;
