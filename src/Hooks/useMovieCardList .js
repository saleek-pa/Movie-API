import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../Configs/Axios";

export const useMovieCardList = (movies, heading) => {
   const navigate = useNavigate();
   const [movie, setMovie] = useState([]);

   useEffect(() => {
      const fetchData = async () => {
         try {
            const response = await axios.get("https://api.themoviedb.org/3/movie/popular?language=en-US&page=1");
            setMovie(response.data.results);
         } catch (error) {
            console.error(error);
         }
      };

      fetchData();
   }, [setMovie]);

   return (
      <>
         <div className="list-heading">
            <h3>{heading}</h3>
         </div>
         <div className="movie-card-container">
            {movie.map((movie) => (
               <div className="movie-card" key={movie.id} onClick={() => navigate(`/movie/${movie.original_title.toLowerCase()}`)}>
                  <img
                     src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                     alt={movie.original_title}
                     className="movie-image"
                  />
                  <div className="movie-title">
                     {movie.original_title} ({movie.release_date.split("-")[0]})
                  </div>
                  <div className="movie-review">{movie.rating}</div>
               </div>
            ))}
         </div>
      </>
   );
};
