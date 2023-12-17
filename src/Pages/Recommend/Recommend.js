import React, { useContext, useEffect, useState } from "react";
import axios from "../../Configs/Axios";
import { Navbar } from "../../Components/Navbar/Navbar";
import { useNavigate } from "react-router-dom";
import { MovieContext } from "../../App";
import { convertDateFormat } from "../../Redux/utils";
import "../Discover/Discover.css";

export default function Recommend() {
   const { isMovie, setIsMovie, dates, user } = useContext(MovieContext);
   const [watchlist, setWatchlist] = useState([]);
   const navigate = useNavigate();

   useEffect(() => {
      const fetchData = async () => {
         try {
            const getPositiveRatingIds = () => {
               const completedItems = isMovie ? user.completed.movies : user.completed.series;
               return completedItems.filter((item) => item.rating > 0).map((item) => item.id);
            };
            const ids = getPositiveRatingIds();
            const releaseDateKey = isMovie ? "release_date" : "first_air_date";

            const details = await Promise.all(
               ids.map((id) =>
                  axios
                     .get(`https://api.themoviedb.org/3/${isMovie ? "movie" : "tv"}/${id}?append_to_response=credits`)
                     .then((response) => response.data)
                     .catch((error) => console.error(error))
               )
            );

            const watchHistory = details.filter((movie) => movie[releaseDateKey] <= dates[0]);
            const allGenreIds = [...new Set(watchHistory.flatMap((movie) => movie.genres.map((genre) => genre.id)))];
            console.log(allGenreIds);

            // const allCastIds = [
            //    ...new Set(watchHistory.flatMap((movie) => movie.credits.cast.slice(0, 5).map((cast) => cast.id))),
            // ];
            // const allDirectorIds = [
            //    ...new Set(
            //       watchHistory.flatMap((movie) =>
            //          movie.credits.crew.filter((director) => director.job === "Director").map((dir) => dir.id)
            //       )
            //    ),
            // ];

            const recommendations = await Promise.all(
               ids.map((id) =>
                  axios
                     .get(`https://api.themoviedb.org/3/${isMovie ? "movie" : "tv"}/${id}/recommendations`)
                     .then((response) => response.data)
                     .catch((error) => console.error(error))
               )
            );

            const similarMovies = recommendations.flatMap((obj) => obj.results);

            const sortedByGenreMatch = similarMovies
               .filter((movie) => movie.genre_ids.some((gen) => allGenreIds.includes(gen)))
               .sort(
                  (a, b) =>
                     b.genre_ids.filter((gen) => allGenreIds.includes(gen)).length -
                     a.genre_ids.filter((gen) => allGenreIds.includes(gen)).length
               );

            const watchlistIds = isMovie ? user.watchlist.movies : user.watchlist.series;
            const completedAndWatchlistIds = [...ids, ...watchlistIds];

            const uniqueSimilarMovies = Array.from(new Set(sortedByGenreMatch.map((movie) => movie.id)))
               .map((id) => similarMovies.find((movie) => movie.id === id))
               .filter((movie) => !completedAndWatchlistIds.includes(movie.id));

            setWatchlist(uniqueSimilarMovies);
         } catch (error) {
            console.error(error);
         }
      };

      fetchData();
   }, [isMovie, dates, user]);

   const toggleMovieSeries = (e) => {
      setIsMovie(e.target.textContent === "Movie" ? true : false);
   };

   return (
      <div className="main-content-container">
         <Navbar />

         <div className="movie-card-container">
            <div className="list-heading-copy">
               <div className="discover-filters" style={{ marginBottom: "15px" }}>
                  <h3>Recommended</h3>
                  <div className="paste-button">
                     <button className="dropdown-button">{isMovie ? "Movie" : "Series"} &nbsp; ▼</button>
                     <div className="dropdown-content">
                        <li onClick={toggleMovieSeries}>Movie</li>
                        <li onClick={toggleMovieSeries}>Series</li>
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
