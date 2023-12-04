import React, { useContext, useEffect, useState } from "react";
import axios from "../../Configs/Axios";
import { Navbar } from "../../Components/Navbar/Navbar";
import { useNavigate } from "react-router-dom";
import { MovieContext } from "../../App";
import "../Discover/Discover.css";

export default function Watchlist() {
   const { isMovie, setIsMovie, dates } = useContext(MovieContext);
   const [watchlist, setWatchlist] = useState([]);
   const [released, setReleased] = useState(true);
   const navigate = useNavigate();

   useEffect(() => {
      const fetchData = async () => {
         try {
            const userWatchlistID = [
               { movies: [872585, 475946, 19995, 572802], series: [202411, 84958, 204082, 209479] },
            ];
            const ids = isMovie ? userWatchlistID[0].movies : userWatchlistID[0].series;
            const details = await Promise.all(
               ids.map((id) =>
                  axios
                     .get(`https://api.themoviedb.org/3/${isMovie ? "movie" : "tv"}/${id}`)
                     .then((response) => response.data)
                     .catch((error) => console.error(error))
               )
            );
            const releaseDateKey = isMovie ? "release_date" : "first_air_date";
            setWatchlist(
               details.filter((movie) =>
                  released ? movie[releaseDateKey] <= dates[0] : movie[releaseDateKey] >= dates[0]
               )
            );
         } catch (error) {
            console.error(error);
         }
      };

      fetchData();
   }, [isMovie, released, dates]);

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

   const toggleMovieSeries = (e) => {
      setIsMovie(e.target.textContent === "Movie" ? true : false);
   };

   const toggleReleasedUpcoming = (e) => {
      setReleased(e.target.textContent === "Released" ? true : false);
   };

   return (
      <div className="main-content-container">
         <Navbar />

         <div className="movie-card-container">
            <div className="list-heading-copy">
               <div className="discover-filters" style={{ marginBottom: "15px" }}>
                  <h3>Watchlist</h3>
                  <div className="paste-button">
                     <button className="dropdown-button">{isMovie ? "Movie" : "Series"} &nbsp; ▼</button>
                     <div className="dropdown-content">
                        <li onClick={toggleMovieSeries}>Movie</li>
                        <li onClick={toggleMovieSeries}>Series</li>
                     </div>
                  </div>
                  <div className="paste-button">
                     <button className="dropdown-button">{released ? "Released" : "Upcoming"} &nbsp; ▼</button>
                     <div className="dropdown-content">
                        <li onClick={toggleReleasedUpcoming}>Released</li>
                        <li onClick={toggleReleasedUpcoming}>Upcoming</li>
                     </div>
                  </div>
               </div>
            </div>

            <div className="view-more-movie-card-list">
               {watchlist.map((movie) => (
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
                        {movie.title || movie.name} (
                        {isMovie
                           ? (movie.release_date || "").split("-")[0]
                           : (movie.first_air_date || "").split("-")[0]}
                        )
                     </div>
                     <div className="movie-review">
                        {movie.vote_average > 0
                           ? movie.vote_average.toFixed(1)
                           : convertDateFormat(movie.release_date || movie.first_air_date || "N/A")}
                     </div>
                  </div>
               ))}
            </div>
         </div>
      </div>
   );
}
