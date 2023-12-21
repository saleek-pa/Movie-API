import React, { useContext } from "react";
import { MDBIcon } from "mdb-react-ui-kit";
import { useNavigate } from "react-router-dom";
import { MovieContext } from "../../App";
import { convertDateFormat } from "../../Redux/utils";

export const CardList = ({ movies, page }) => {
   const { isMovie } = useContext(MovieContext);
   const navigate = useNavigate();
   return (
      <div className="view-more-movie-card-list">
         {movies.map((movie) => (
            <div
               className="movie-card"
               key={movie.id}
               onClick={() =>
                  navigate(
                     `/${isMovie ? "movie" : "tv"}/${movie.id}-${
                        isMovie
                           ? movie.title.toLowerCase().replace(/\s+/g, "-")
                           : movie.name.toLowerCase().replace(/\s+/g, "-")
                     }`
                  )
               }
            >
               <img
                  src={
                     movie.poster_path
                        ? `https://image.tmdb.org/t/p/w200${movie.poster_path}`
                        : "https://www.tgv.com.my/assets/images/404/movie-poster.jpg"
                  }
                  alt={movie.title || movie.name}
                  className="movie-image"
               />
               <div className="movie-title">
                  {movie.title
                     ? movie.title.length > 27
                        ? `${movie.title.slice(0, 27)}...`
                        : movie.title
                     : movie.name.length > 27
                     ? `${movie.name.slice(0, 27)}...`
                     : movie.name}{" "}
                  ({isMovie ? (movie.release_date || "").split("-")[0] : (movie.first_air_date || "").split("-")[0]})
               </div>
               <div className="movie-review">
                  {movie.vote_average > 0
                     ? movie.vote_average.toFixed(1)
                     : convertDateFormat(movie.release_date || movie.first_air_date || "")}
               </div>
               <div className="card-hover-icon">
                  <MDBIcon far icon="heart" className="card-watchlist" />
                  <MDBIcon fas icon="check" className="card-completed" />
                  {page === "recommend" && <MDBIcon fas icon="close" className="card-close" />}
               </div>
            </div>
         ))}
      </div>
   );
};
