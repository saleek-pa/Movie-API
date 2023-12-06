import React, { useCallback, useContext, useEffect, useRef, useState } from "react";
import axios from "../../Configs/Axios";
import { Navbar } from "../../Components/Navbar/Navbar";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { MovieContext } from "../../App";
import "./ViewMore.css";

export default function ViewMoreMovie() {
   const { title } = useParams();
   const navigate = useNavigate();
   const { dates } = useContext(MovieContext);
   const [series, setSeries] = useState([]);
   const [pageNumber, setPageNumber] = useState(0);
   const loadingRef = useRef(null);

   const fetchData = useCallback(async () => {
      try {
         const MOVIE_ENDPOINTS = {
            "trending-now": `trending/tv/week?page=${pageNumber}`,
            "ongoing-series": `discover/tv?first_air_date.gte=${dates[1]}&first_air_date.lte=${dates[0]}&include_adult=true&include_null_first_air_dates=false&sort_by=popularity.desc&vote_average.gte=0.1&page=${pageNumber}`,
            "upcoming-series": `discover/tv?first_air_date.gte=${dates[0]}&include_adult=true&include_null_first_air_dates=false&sort_by=first_air_date.asc&vote_average.lte=0.1&page=${pageNumber}`,
            "top-rated": `tv/top_rated?page=${pageNumber}`,
         };

         const endpoint = `https://api.themoviedb.org/3/${MOVIE_ENDPOINTS[title]}`;
         const response = await axios.get(endpoint);
         setSeries((prevSeries) => [...prevSeries, ...response.data.results]);
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
               {series.map((series) => (
                  <div
                     className="movie-card"
                     key={series.id}
                     onClick={() => navigate(`/tv/${series.id}-${series.name.toLowerCase().replace(/\s+/g, "-")}`)}
                  >
                     <img
                        src={
                           series.poster_path
                              ? `https://image.tmdb.org/t/p/w200${series.poster_path}`
                              : "https://www.tgv.com.my/assets/images/404/movie-poster.jpg"
                        }
                        alt={series.name}
                        className="movie-image"
                     />
                     <div className="movie-title">
                        {series.name} ({series.first_air_date.split("-")[0]})
                     </div>
                     <div className="movie-review">
                        {series.vote_average > 0
                           ? series.vote_average.toFixed(1)
                           : convertDateFormat(series.first_air_date)}
                     </div>
                  </div>
               ))}
            </div>
            <div class="loader" ref={loadingRef} />
         </div>
      </div>
   );
}
