import React, { useCallback, useContext, useEffect, useRef, useState } from "react";
import axios from "../../Configs/Axios";
import { Navbar } from "../../Components/Navbar/Navbar";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { MovieContext } from "../../App";
import "./ViewMore.css";

export default function ViewMoreMovie() {
   const { title } = useParams();
   const { dates } = useContext(MovieContext);
   const [movies, setMovies] = useState([]);
   const [pageNumber, setPageNumber] = useState(0);
   const loadingRef = useRef(null);
   const navigate = useNavigate();

   const fetchData = useCallback(async () => {
      try {
         const MOVIE_ENDPOINTS = {
            "trending-now": `trending/movie/week?page=${pageNumber}`,
            "now-playing": `discover/movie?include_adult=true&include_video=false&release_date.gte=${dates[1]}&release_date.lte=${dates[0]}&region=In&sort_by=popularity.desc&vote_average.gte=0.1&page=${pageNumber}`,
            upcoming: `discover/movie?include_adult=true&include_video=false&release_date.gte=${dates[0]}&region=In&sort_by=release_date.asc&vote_average.lte=0.1&page=${pageNumber}`,
            "top-rated": `movie/top_rated?page=${pageNumber}`,
         };

         const endpoint = `https://api.themoviedb.org/3/${MOVIE_ENDPOINTS[title]}`;
         const response = await axios.get(endpoint);
         setMovies((prevMovies) => [...prevMovies, ...response.data.results]);
      } catch (error) {
         console.error(error);
      }
   }, [title, pageNumber, dates]);

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

   function convertDateFormat(inputDate) {
      const dateParts = inputDate.split("-");
      const year = parseInt(dateParts[0]);
      const month = parseInt(dateParts[1]) - 1;
      const day = parseInt(dateParts[2]);

      const formattedDate = new Date(year, month, day).toLocaleDateString("en-US", {
         year: "numeric",
         month: "short",
         day: "numeric",
      });

      return formattedDate;
   }

   return (
      <div className="main-content-container">
         <Navbar />

         <div className="movie-card-container">
            <div className="list-heading">
               <h3>{heading}</h3>
            </div>
            <div className="view-more-movie-card-list">
               {movies.map((movie) => (
                  <div
                     className="movie-card"
                     key={movie.id}
                     onClick={() => navigate(`/movie/${movie.id}-${movie.title.toLowerCase().replace(/\s+/g, "-")}`)}
                  >
                     <img
                        src={
                           movie.poster_path
                              ? `https://image.tmdb.org/t/p/w200${movie.poster_path}`
                              : "https://www.tgv.com.my/assets/images/404/movie-poster.jpg"
                        }
                        alt={movie.title}
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
                        ({movie.release_date.split("-")[0]})
                     </div>
                     <div className="movie-review">
                        {movie.vote_average > 0 ? movie.vote_average.toFixed(1) : convertDateFormat(movie.release_date)}
                     </div>
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
