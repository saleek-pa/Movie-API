import React from "react";
import { useNavigate } from "react-router-dom";

export const useMovieCardList = (movies, heading) => {
    const navigate = useNavigate()
   return (
      <>
         <div className="list-heading">
            <h3>{heading}</h3>
         </div>
         <div className="movie-card-container">
            {movies.map((movie, index) => (
               <div className="movie-card" key={index} onClick={() => navigate(`/movie/${movie.title}`)}>
                  <img src={movie.image} alt={movie.title} className="movie-image" />
                  <div className="movie-title">
                     {movie.title} ({movie.year})
                  </div>
                  <div className="movie-review">{movie.rating}</div>
               </div>
            ))}
         </div>
      </>
   );
};
