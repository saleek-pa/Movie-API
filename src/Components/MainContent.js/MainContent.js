import React from "react";
import { Navbar } from "../Navbar/Navbar";
import { movies } from "../../DummyData";
import "./MainContent.css";

export const MainContent = () => {
   console.log(movies);
   return (
      <div className="main-content-container">
         <Navbar />
         <div className="list-heading">
            <h3>Trending Now</h3>
         </div>
         <div className="movie-card-container">
            {movies.map((movie) => (
               <div class="movie-card">
                  <img src={movie.image} alt={movie.title} class="movie-image" />
                  <div class="movie-title">
                     {movie.title} ({movie.year})
                  </div>
                  <div class="movie-review">{movie.rating}</div>
               </div>
            ))}
         </div>

         <div className="list-heading">
            <h3>Returning this Week</h3>
         </div>
         <div className="movie-card-container">
            {movies.reverse().map((movie) => (
               <div class="movie-card">
                  <img src={movie.image} alt={movie.title} class="movie-image" />
                  <div class="movie-title">
                     {movie.title} ({movie.year})
                  </div>
                  <div class="movie-review">{movie.rating}</div>
               </div>
            ))}
         </div>

         <div className="list-heading">
            <h3>New Shows Airing in November</h3>
         </div>
         <div className="movie-card-container">
            {movies.reverse().map((movie) => (
               <div class="movie-card">
                  <img src={movie.image} alt={movie.title} class="movie-image" />
                  <div class="movie-title">
                     {movie.title} ({movie.year})
                  </div>
                  <div class="movie-review">{movie.rating}</div>
               </div>
            ))}
         </div>

         <div className="list-heading">
            <h3>Most Popular</h3>
         </div>
         <div className="movie-card-container">
            {movies.reverse().map((movie) => (
               <div class="movie-card">
                  <img src={movie.image} alt={movie.title} class="movie-image" />
                  <div class="movie-title">
                     {movie.title} ({movie.year})
                  </div>
                  <div class="movie-review">{movie.rating}</div>
               </div>
            ))}
         </div>
      </div>
   );
};
