import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./CardList.css";
import { MDBIcon } from "mdb-react-ui-kit";

export const useMovieCardList = (movies, heading) => {
   const navigate = useNavigate();
   const movieListRef = useRef(null);

   const handleScroll = (scrollOffset) => {
      if (movieListRef.current) {
         movieListRef.current.scrollLeft += scrollOffset;
      }
   };

   const MovieCardList = () => (
      <div className="movie-card-container">
         <div className="list-heading">
            <h3>{heading}</h3>
            <button className="cta">
               <span
                  className="hover-underline-animation"
                  onClick={() => navigate(`/movie/discover/${heading.toLowerCase().replace(" ", "-")}`)}
               >
                  View more
               </span>
            </button>
         </div>
         <div className="movie-card-list" ref={movieListRef}>
            {movies.map((movie) => (
               <div
                  className="movie-card"
                  key={movie.id}
                  onClick={() => navigate(`/movie/${movie.id}-${movie.title.toLowerCase().replace(/\s+/g, "-")}`)}
               >
                  <img
                     src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                     alt={movie.title}
                     className="movie-image"
                  />
                  <div className="movie-title">
                     {movie.title} ({movie.release_date.split("-")[0]})
                  </div>
                  <div className="movie-review">{movie.vote_average.toFixed(1)}</div>
               </div>
            ))}
         </div>
         <button className="scroll-button left" onClick={() => handleScroll(-1020)}>
            <MDBIcon fas icon="chevron-left" />
         </button>
         <button className="scroll-button right" onClick={() => handleScroll(1020)}>
            <MDBIcon fas icon="chevron-right" />
         </button>
      </div>
   );

   return MovieCardList;
};

export default useMovieCardList;
