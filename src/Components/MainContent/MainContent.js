import React, { useContext, useEffect, useState } from "react";
import { Navbar } from "../Navbar/Navbar";
import { MovieContext } from "../../App";
import useMovieCardList from "../../Hooks/useMovieCardList";
import axios from "../../Configs/Axios";
import "./MainContent.css";

export const MainContent = () => {
   const { isMovie, dates } = useContext(MovieContext);
   const [trendingMovies, setTrendingMovies] = useState([]);
   const [nowPlayingMovies, setNowPlayingMovies] = useState([]);
   const [upcomingMovies, setUpcomingMovies] = useState([]);
   const [topRatedMovies, setTopRatedMovies] = useState([]);

   useEffect(() => {
      const fetchData = async () => {
         try {
            const endpoint1 = `https://api.themoviedb.org/3/trending/${isMovie ? "movie" : "tv"}/week`;

            const endpoint2 = isMovie
               ? `https://api.themoviedb.org/3/discover/movie?release_date.gte=${dates[1]}&release_date.lte=${dates[0]}&region=In&sort_by=popularity.desc&vote_average.gte=0.1`
               : `https://api.themoviedb.org/3/discover/tv?first_air_date.gte=${dates[1]}&first_air_date.lte=${dates[0]}&sort_by=popularity.desc&vote_average.gte=0.1`;

            const endpoint3 = isMovie
               ? `https://api.themoviedb.org/3/discover/movie?release_date.gte=${dates[0]}&region=In&sort_by=release_date.asc&vote_average.lte=0.1`
               : `https://api.themoviedb.org/3/discover/tv?first_air_date.gte=${dates[0]}&sort_by=first_air_date.asc&vote_average.lte=0.1`;

            const endpoint4 = `https://api.themoviedb.org/3/${isMovie ? "movie" : "tv"}/top_rated`;

            const [response1, response2, response3, response4] = await Promise.all([
               axios.get(endpoint1),
               axios.get(endpoint2),
               axios.get(endpoint3),
               axios.get(endpoint4),
            ]);

            setTrendingMovies(response1.data.results);
            setNowPlayingMovies(response2.data.results);
            setUpcomingMovies(response3.data.results);
            setTopRatedMovies(response4.data.results);
         } catch (error) {
            console.error(error);
         }
      };

      fetchData();
   }, [isMovie, dates]);

   const TrendingNow = useMovieCardList(trendingMovies, "Trending Now");
   const NowPlaying = useMovieCardList(nowPlayingMovies, `${isMovie ? "Now Playing" : "Ongoing Series"}`);
   const Upcoming = useMovieCardList(upcomingMovies, "Upcoming");
   const TopRated = useMovieCardList(topRatedMovies, "Top Rated");

   return (
      <div className="main-content-container">
         <Navbar />

         <TrendingNow />
         <NowPlaying />
         <Upcoming />
         <TopRated />
      </div>
   );
};
