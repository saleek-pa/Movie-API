import React, { useContext, useEffect, useState } from "react";
import { dates } from "../../Redux/utils";
import { Navbar } from "../../Components/Navbar/Navbar";
import { MovieContext } from "../../App";
import useMovieCardList from "../../Hooks/useMovieCardList";
import axios from "../../Configs/Axios";
import "./Home.css"

export const Home = () => {
   const { isMovie } = useContext(MovieContext);
   const [trendingMovies, setTrendingMovies] = useState([]);
   const [nowPlayingMovies, setNowPlayingMovies] = useState([]);
   const [upcomingMovies, setUpcomingMovies] = useState([]);
   const [topRatedMovies, setTopRatedMovies] = useState([]);

   useEffect(() => {
      const fetchData = async () => {
         try {
            const endpoints = [
               `https://api.themoviedb.org/3/trending/${isMovie ? "movie" : "tv"}/week`,
               `https://api.themoviedb.org/3/${isMovie ? "movie" : "tv"}/top_rated`,

               isMovie
                  ? `https://api.themoviedb.org/3/discover/movie?release_date.gte=${dates[1]}&release_date.lte=${dates[0]}&region=IN&sort_by=popularity.desc&vote_average.gte=0.1`
                  : `https://api.themoviedb.org/3/discover/tv?first_air_date.gte=${dates[1]}&first_air_date.lte=${dates[0]}&sort_by=popularity.desc&vote_average.gte=0.1`,
               isMovie
                  ? `https://api.themoviedb.org/3/discover/movie?release_date.gte=${dates[0]}&region=IN&sort_by=release_date.asc&vote_average.lte=0.1`
                  : `https://api.themoviedb.org/3/discover/tv?first_air_date.gte=${dates[0]}&sort_by=first_air_date.asc&vote_average.lte=0.1`,
            ];

            const [response1, response2, response3, response4] = await Promise.all(
               endpoints.map((endpoint) => axios.get(endpoint))
            );

            setTrendingMovies(response1.data.results);
            setTopRatedMovies(response2.data.results);
            setNowPlayingMovies(response3.data.results);
            setUpcomingMovies(response4.data.results);
         } catch (error) {
            console.error(error);
         }
      };

      fetchData();
   }, [isMovie]);

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
