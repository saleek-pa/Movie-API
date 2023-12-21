import React, { useCallback, useEffect, useRef, useState } from "react";
import axios from "../../Configs/Axios";
import { dates } from "../../Redux/utils";
import { Navbar } from "../../Components/Navbar/Navbar";
import { useParams } from "react-router-dom";
import { CardList } from "../../Components/MovieCardList/MovieCardList";
import "./ViewMore.css";

export default function ViewMoreMovie() {
   const { title } = useParams();
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
            </div>
            <CardList movies={series} />
            <div className="loader" ref={loadingRef} />
         </div>
      </div>
   );
}
