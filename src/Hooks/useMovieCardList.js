import React from "react";
import { useNavigate } from "react-router-dom";

export const useMovieCardList = (movies, heading) => {
   const navigate = useNavigate();

   console.log(movies)

   const MovieCardList = () => (
      <>
         <div className="list-heading">
            <h3>{heading}</h3>
            <button class="cta">
               <span class="hover-underline-animation"> View more </span>
            </button>
         </div>
         <div className="movie-card-container">
            {movies.map((movie) => (
               <div
                  className="movie-card"
                  key={movie.id}
                  onClick={() =>
                     navigate(`/movie/${movie.id}-${movie.original_title.toLowerCase().replace(/\s+/g, "-")}`)
                  }
               >
                  <img
                     src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                     alt={movie.original_title}
                     className="movie-image"
                  />
                  <div className="movie-title">
                     {movie.media_type === "movie" ? movie.original_title : movie.name} (
                     {movie.media_type === "movie" && movie.release_date.split("-")[0]})
                  </div>
                  <div className="movie-review">{movie.vote_average.toFixed(1)}</div>
               </div>
            ))}
         </div>
      </>
   );

   return MovieCardList;
};

export default useMovieCardList;
