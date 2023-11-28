import React, { useContext, useEffect, useState } from "react";
import { Navbar } from "../Navbar/Navbar";
import { MovieContext } from "../../App";
import { useMovieCardList } from "../../Hooks/useMovieCardList";
import useSeriesCardList from "../../Hooks/useSeriesCardList";
import axios from "../../Configs/Axios";
import "./MainContent.css";

export const MainContent = () => {
   const { isMovie } = useContext(MovieContext);
   const [trendingMovies, setTrendingMovies] = useState([]);
   const [nowPlayingMovies, setNowPlayingMovies] = useState([]);
   const [upcomingMovies, setUpcomingMovies] = useState([]);
   const [topRatedMovies, setTopRatedMovies] = useState([]);

   const [trendingSeries, setTrendingSeries] = useState([]);
   const [airingTodaySeries, setAiringTodaySeries] = useState([]);
   const [onTheAirSeries, setOnTheAirSeries] = useState([]);
   const [topRatedSeries, setTopRatedSeries] = useState([]);

   useEffect(() => {
      const fetchData = async () => {
         try {
            const endpoint1 = isMovie
               ? "https://api.themoviedb.org/3/trending/movie/day"
               : "https://api.themoviedb.org/3/trending/tv/day";

            const endpoint2 = isMovie
               ? "https://api.themoviedb.org/3/movie/now_playing"
               : "https://api.themoviedb.org/3/tv/airing_today";

            const endpoint3 = isMovie
               ? "https://api.themoviedb.org/3/movie/upcoming"
               : "https://api.themoviedb.org/3/tv/on_the_air";

            const endpoint4 = isMovie
               ? "https://api.themoviedb.org/3/movie/top_rated"
               : "https://api.themoviedb.org/3/tv/top_rated";

            const [response1, response2, response3, response4] = await Promise.all([
               axios.get(endpoint1),
               axios.get(endpoint2),
               axios.get(endpoint3),
               axios.get(endpoint4),
            ]);

            isMovie ? setTrendingMovies(response1.data.results) : setTrendingSeries(response1.data.results);
            isMovie ? setNowPlayingMovies(response2.data.results) : setAiringTodaySeries(response2.data.results);
            isMovie ? setUpcomingMovies(response3.data.results) : setOnTheAirSeries(response3.data.results);
            isMovie ? setTopRatedMovies(response4.data.results) : setTopRatedSeries(response4.data.results);
         } catch (error) {
            console.error(error);
         }
      };

      fetchData();
   }, [isMovie]);

   const TrendingMovies = useMovieCardList(trendingMovies, "Trending Now");
   const NowPlayingMovies = useMovieCardList(nowPlayingMovies, "Now Playing");
   const UpcomingMovies = useMovieCardList(upcomingMovies, "Upcoming");
   const TopRatedMovies = useMovieCardList(topRatedMovies, "Top Rated");

   const TrendingSeries = useSeriesCardList(trendingSeries, "Trending Now");
   const AiringTodaySeries = useSeriesCardList(airingTodaySeries, "Airing Today");
   const OnTheAirSeries = useSeriesCardList(onTheAirSeries, "On The Air");
   const TopRatedSeries = useSeriesCardList(topRatedSeries, "Top Rated");

   return (
      <div className="main-content-container">
         <Navbar />

         {isMovie ? (
            <>
               <TrendingMovies />
               <NowPlayingMovies />
               <UpcomingMovies />
               <TopRatedMovies />
            </>
         ) : (
            <>
               <TrendingSeries />
               <AiringTodaySeries />
               <OnTheAirSeries />
               <TopRatedSeries />
            </>
         )}
      </div>
   );
};
