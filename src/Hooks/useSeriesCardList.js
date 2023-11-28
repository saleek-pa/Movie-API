import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./CardList.css";
import { MDBIcon } from "mdb-react-ui-kit";

export const useSeriesCardList = (tvSeries, heading) => {
   const navigate = useNavigate();
   const movieListRef = useRef(null);

   const handleScroll = (scrollOffset) => {
      if (movieListRef.current) {
         movieListRef.current.scrollLeft += scrollOffset;
      }
   };

   const SeriesCardList = () => (
      <div className="movie-card-container">
         <div className="list-heading">
            <h3>{heading}</h3>
            <button className="cta">
               <span className="hover-underline-animation"> View more </span>
            </button>
         </div>
         <div className="movie-card-list" ref={movieListRef}>
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
         <button className="scroll-button left" onClick={() => handleScroll(-1020)}>
            <MDBIcon fas icon="chevron-left" />
         </button>
         <button className="scroll-button right" onClick={() => handleScroll(1020)}>
            <MDBIcon fas icon="chevron-right" />
         </button>
      </div>
   );

   return SeriesCardList;
};

export default useSeriesCardList;
