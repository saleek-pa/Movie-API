import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { dates } from '../../Redux/utils';
import MovieList from '../../Components/MovieCardList/MovieList';
import axios from '../../Configs/Axios';

const Home = ({ showSidebar }) => {
  const isMovie = useSelector((state) => state.user.isMovie);
  
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [nowPlayingMovies, setNowPlayingMovies] = useState([]);
  const [upcomingMovies, setUpcomingMovies] = useState([]);
  const [topRatedMovies, setTopRatedMovies] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const endpoints = [
          `https://api.themoviedb.org/3/trending/${isMovie ? 'movie' : 'tv'}/week`,
          `https://api.themoviedb.org/3/${isMovie ? 'movie' : 'tv'}/top_rated`,

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

  return (
    <>
      <MovieList movies={trendingMovies} heading={'Trending Now'} showSidebar={showSidebar} />
      <MovieList movies={nowPlayingMovies} heading={`${isMovie ? 'Now Playing' : 'Ongoing Series'}`} showSidebar={showSidebar} />
      <MovieList movies={upcomingMovies} heading={'Upcoming'} showSidebar={showSidebar} />
      <MovieList movies={topRatedMovies} heading={'Top Rated'} showSidebar={showSidebar} />
    </>
  );
};

export default Home;
