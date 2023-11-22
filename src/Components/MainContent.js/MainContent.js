import React, { useContext, useEffect, useState } from "react";
import { Navbar } from "../Navbar/Navbar";
import { MovieContext } from "../../App";
import { useMovieCardList } from "../../Hooks/useMovieCardList";
import axios from "../../Configs/Axios";
import "./MainContent.css";

export const MainContent = () => {
   const { isMovie } = useContext(MovieContext);
   const [movie, setMovie] = useState([]);

   useEffect(() => {
      const fetchData = async () => {
         try {
            const endpoint = isMovie
               ? "https://api.themoviedb.org/3/trending/movie/day?language=en-US"
               : "https://api.themoviedb.org/3/trending/tv/day?language=en-US";
            const response = await axios.get(endpoint);
            setMovie(response.data.results.slice(0, 6));
         } catch (error) {
            console.error(error);
         }
      };

      fetchData();
   }, [isMovie, setMovie]);

   console.log(movie);

   const TrendingNow = useMovieCardList(movie, "Trending Now");
   const NowPlaying = useMovieCardList(movie, "Now Playing");
   const Upcoming = useMovieCardList(movie, "Upcoming");
   const TopRated = useMovieCardList(movie, "Top Rated");
   const ReturningThisWeek = useMovieCardList(movie, "Returning this Week");
   const NewShowsAiringInNovember = useMovieCardList(movie, "New Shows Airing in November");

   return (
      <div className="main-content-container">
         <Navbar />

         <TrendingNow />
         {isMovie ? (
            <>
               <NowPlaying />
               <Upcoming />
            </>
         ) : (
            <>
               <ReturningThisWeek />
               <NewShowsAiringInNovember />
            </>
         )}
         <TopRated />
      </div>
   );
};
