import React, { useContext, useEffect, useState } from "react";
import axios from "../../Configs/Axios";
import { dates } from "../../Redux/utils";
import { Navbar } from "../../Components/Navbar/Navbar";
import { CardList } from "../../Components/MovieCardList/MovieCardList";
import { MovieContext } from "../../App";
import "../Discover/Discover.css";

export default function Recommend() {
   const { isMovie, setIsMovie, user } = useContext(MovieContext);
   const [recommend, setRecommend] = useState([]);

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

            setRecommend(uniqueSimilarMovies);
         } catch (error) {
            console.error(error);
         }
      };

      fetchData();
   }, [isMovie, user]);

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

            <CardList movies={recommend} page={"recommend"} />
            {recommend.length === 0 && <h3 className="text-center text-muted">Its empty!</h3>}
         </div>
      </div>
   );
}
