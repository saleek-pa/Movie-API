import React, { useContext, useEffect, useState } from "react";
import { Navbar } from "../Navbar/Navbar";
import { MovieContext } from "../../App";
import { useMovieCardList } from "../../Hooks/useMovieCardList";
import useSeriesCardList from "../../Hooks/useSeriesCardList";
import axios from "../../Configs/Axios";
import "./MainContent.css";

export const MainContent = () => {
   const { isMovie, dates } = useContext(MovieContext);
   const [trendingMovies, setTrendingMovies] = useState([]);
   const [nowPlayingMovies, setNowPlayingMovies] = useState([]);
   const [upcomingMovies, setUpcomingMovies] = useState([]);
   const [topRatedMovies, setTopRatedMovies] = useState([]);

   const [trendingSeries, setTrendingSeries] = useState([]);
   const [ongoingSeries, setOngoingSeries] = useState([]);
   const [upcomingSeries, setUpcomingSeries] = useState([]);
   const [topRatedSeries, setTopRatedSeries] = useState([]);

   useEffect(() => {
      const fetchData = async () => {
         try {
            const endpoint1 = `https://api.themoviedb.org/3/trending/${isMovie ? "movie" : "tv"}/week`;

            const endpoint2 = isMovie
               ? `https://api.themoviedb.org/3/discover/movie?include_adult=true&include_video=false&release_date.gte=${dates[1]}&release_date.lte=${dates[0]}&region=In&sort_by=popularity.desc&vote_average.gte=0.1`
               : `https://api.themoviedb.org/3/discover/tv?first_air_date.gte=${dates[1]}&first_air_date.lte=${dates[0]}&include_adult=true&include_null_first_air_dates=false&sort_by=popularity.desc&vote_average.gte=0.1`;

            const endpoint3 = isMovie
               ? `https://api.themoviedb.org/3/discover/movie?include_adult=true&include_video=false&release_date.gte=${dates[0]}&region=In&sort_by=release_date.asc&vote_average.lte=0.1`
               : `https://api.themoviedb.org/3/discover/tv?first_air_date.gte=${dates[0]}&include_adult=true&include_null_first_air_dates=false&sort_by=first_air_date.asc&vote_average.lte=0.1`;

            const endpoint4 = `https://api.themoviedb.org/3/${isMovie ? "movie" : "tv"}/top_rated`;

            const [response1, response2, response3, response4] = await Promise.all([
               axios.get(endpoint1),
               axios.get(endpoint2),
               axios.get(endpoint3),
               axios.get(endpoint4),
            ]);

            isMovie ? setTrendingMovies(response1.data.results) : setTrendingSeries(response1.data.results);
            isMovie ? setNowPlayingMovies(response2.data.results) : setOngoingSeries(response2.data.results);
            isMovie ? setUpcomingMovies(response3.data.results) : setUpcomingSeries(response3.data.results);
            isMovie ? setTopRatedMovies(response4.data.results) : setTopRatedSeries(response4.data.results);
         } catch (error) {
            console.error(error);
         }
      };

      fetchData();
   }, [isMovie, dates]);

   const TrendingMovies = useMovieCardList(trendingMovies, "Trending Now");
   const NowPlayingMovies = useMovieCardList(nowPlayingMovies, "Now Playing");
   const UpcomingMovies = useMovieCardList(upcomingMovies, "Upcoming");
   const TopRatedMovies = useMovieCardList(topRatedMovies, "Top Rated");

   const TrendingSeries = useSeriesCardList(trendingSeries, "Trending Now");
   const OngoingSeries = useSeriesCardList(ongoingSeries, "Ongoing Series");
   const UpcomingSeries = useSeriesCardList(upcomingSeries, "Upcoming Series");
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
               <OngoingSeries />
               <UpcomingSeries />
               <TopRatedSeries />
            </>
         )}
      </div>
   );
};
