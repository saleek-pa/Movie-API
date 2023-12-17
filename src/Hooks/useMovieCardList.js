import React, { useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { MDBIcon } from "mdb-react-ui-kit";
import { MovieContext } from "../App";
import { convertDateFormat } from "../Redux/utils";
import { MovieCardListLoading } from "../Components/SkeletonLoading/SkeletonLoading";
import "./CardList.css";

const useMovieCardList = (movies, heading) => {
   const navigate = useNavigate();
   const movieListRef = useRef(null);
   const { isMovie } = useContext(MovieContext);

   const handleScroll = (scrollOffset) => {
      if (movieListRef.current) {
         movieListRef.current.scrollLeft += scrollOffset;
      }
   };

   const MovieCardList = () => (
      <div className="movie-card-container">
         <div className="list-heading">
            <h3>{heading}</h3>
            {!heading.startsWith("Similar") && (
               <button className="cta">
                  <span
                     className="hover-underline-animation"
                     onClick={() =>
                        navigate(`/${isMovie ? "movie" : "tv"}/discover/${heading.toLowerCase().replace(" ", "-")}`)
                     }
                  >
                     View more
                  </span>
               </button>
            )}
         </div>
         {movies.length > 0 ? (
            <div className="movie-card-list" ref={movieListRef}>
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
                        (
                        {isMovie
                           ? (movie.release_date || "").split("-")[0]
                           : (movie.first_air_date || "").split("-")[0]}
                        )
                     </div>
                     <div className="movie-review">
                        {movie.vote_average > 0
                           ? movie.vote_average.toFixed(1)
                           : convertDateFormat(movie.release_date || movie.first_air_date || "")}
                     </div>
                     <div className="card-hover-icon">
                        <MDBIcon fas icon="heart" className="card-watchlist" />
                        <MDBIcon fas icon="check" className="card-completed" />
                     </div>
                  </div>
               ))}
            </div>
         ) : (
            <div style={{ display: "flex" }}>
               {[...Array(6)].map((_, index) => (
                  <MovieCardListLoading key={index} />
               ))}
            </div>
         )}
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
