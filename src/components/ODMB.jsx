/* eslint-disable react/prop-types */

const ODMB = ({ movie: { Title, Year, imdbRating, Poster, Language } }) => {
  return (
    <div className="movie-card">
      <img src={Poster ? Poster : "/no-movie.png"} alt={Title} />

      <div className="mt-4">
        <h3>{Title}</h3>

        <div className="content">
          <div className="rating">
            <img src="star.svg" alt="Star Icon" />
            <p>{imdbRating ? imdbRating : "N/A"} </p>
          </div>

          <span>•</span>
          <p className="lang">
            {Language.includes(",")
              ? Language.slice(0, Language.indexOf(","))
              : Language}
          </p>
          <span>•</span>
          <p className="year">{Year ? Year : "N/A"}</p>
        </div>
      </div>
    </div>
  );
};

// http://img.omdbapi.com/?apikey=eb5161f5&i=tt4154796
export default ODMB;
