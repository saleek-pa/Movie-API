import React, { useCallback, useEffect, useRef, useState } from "react";
import axios from "../../Configs/Axios";
import { Navbar } from "../../Components/Navbar/Navbar";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "./ViewMore.css";

export default function ViewMoreMovie() {
   const { title } = useParams();
   const navigate = useNavigate();
   const [movies, setMovies] = useState([]);
   const [pageNumber, setPageNumber] = useState(0);
   const loadingRef = useRef(null);

   const fetchData = useCallback(async () => {
      try {
         const MOVIE_ENDPOINTS = {
            "trending-now": "trending/movie/day",
            "now-playing": "movie/now_playing",
            "upcoming": "movie/upcoming",
            "top-rated": "movie/top_rated",
         };

         const endpoint = `https://api.themoviedb.org/3/${MOVIE_ENDPOINTS[title]}?page=${pageNumber}`;
         const response = await axios.get(endpoint);
         setMovies((prevMovies) => [...prevMovies, ...response.data.results]);
      } catch (error) {
         console.error(error);
      }
   }, [title, pageNumber]);

   useEffect(() => {
      fetchData();
   }, [fetchData]);

   useEffect(() => {
      const observer = new IntersectionObserver(
         (entries) => {
            if (entries[0].isIntersecting) {
               setPageNumber((page) => page + 1);
            }
         },
         { threshold: 0.5 }
      );

      if (loadingRef.current) observer.observe(loadingRef.current);

      return () => observer.disconnect();
   }, [loadingRef]);

   const heading = title
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

   return (
      <div className="main-content-container">
         <Navbar />

         <div className="movie-card-container">
            <div className="list-heading">
               <h3>{heading}</h3>
               <button className="cta">
                  <span className="hover-underline-animation" onClick={() => navigate(`/movie/discover/${title}`)}>
                     View more
                  </span>
               </button>
            </div>
            <div className="view-more-movie-card-list">
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
            <div className="view-more-loading" ref={loadingRef}>
               <h3>Loading....</h3>
            </div>
         </div>
      </div>
   );
}
