import React from "react";
import { useNavigate } from "react-router-dom";
import "./CardList.css";

export const useSeriesCardList = (tvSeries, heading) => {
   const navigate = useNavigate();

   const SeriesCardList = () => (
      <div className="movie-card-container">
         <div className="list-heading">
            <h3>{heading}</h3>
            <button className="cta">
               <span className="hover-underline-animation"> View more </span>
            </button>
         </div>
         <div className="movie-card-list">
            {tvSeries.map((series) => (
               <div
                  className="movie-card"
                  key={series.id}
                  onClick={() => navigate(`/tv/${series.id}-${series.name.toLowerCase().replace(/\s+/g, "-")}`)}
               >
                  <img
                     src={`https://image.tmdb.org/t/p/w200${series.poster_path}`}
                     alt={series.name}
                     className="movie-image"
                  />
                  <div className="movie-title">
                     {series.name} ({series.first_air_date.split("-")[0]})
                  </div>
                  <div className="movie-review">{series.vote_average.toFixed(1)}</div>
               </div>
            ))}
         </div>
      </div>
   );

   return SeriesCardList;
};

export default useSeriesCardList;
