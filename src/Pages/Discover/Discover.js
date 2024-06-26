import React, { useCallback, useEffect, useRef, useState } from 'react';
import axios from '../../Configs/Axios';
import { dates } from '../../Redux/utils';
import { CardList } from '../../Components/MovieCardList/MovieCardList';
import { setIsMovie } from '../../Redux/movieSlice';
import { useDispatch, useSelector } from 'react-redux';
import './Discover.css';

export default function Discover() {
  const isMovie = useSelector((state) => state.user.isMovie);

  const [movieSeries, setMovieSeries] = useState([]);
  const [pageNumber, setPageNumber] = useState(0);
  const [genres, setGenres] = useState([]);

  const [released, setReleased] = useState(true);
  const [language, setLanguage] = useState('en');
  const [sortBy, setSortby] = useState('popularity.desc');
  const [filterByGenre, setFilterByGenre] = useState([]);

  const loadingRef = useRef(null);
  const dispatch = useDispatch();

  const fetchData = useCallback(async () => {
    try {
      const endpoint = `https://api.themoviedb.org/3/discover/${isMovie ? 'movie' : 'tv'}?include_video=true&${
        isMovie ? 'release' : 'first_air'
      }_date.${released ? 'lte' : 'gte'}=${dates[0]}&sort_by=${sortBy}&vote_average.${
        released ? 'gte' : 'lte'
      }=0.1&with_original_language=${language}&with_genres=${filterByGenre.join(',')}&page=${pageNumber}`;
      const response = await axios.get(endpoint);
      setMovieSeries((prevMovies) => [...prevMovies, ...response.data.results]);

      const genre = await axios.get(`https://api.themoviedb.org/3/genre/${isMovie ? 'movie' : 'tv'}/list`);
      setGenres(genre.data.genres.filter((genre) => genre.id !== 10770 && genre.id !== 10766 && genre.id !== 10767));
    } catch (error) {
      console.error(error);
    }
  }, [isMovie, released, pageNumber, language, sortBy, filterByGenre]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) setPageNumber((page) => page + 1);
      },
      { threshold: 0.5 }
    );

    if (loadingRef.current) observer.observe(loadingRef.current);
    return () => observer.disconnect();
  }, [loadingRef]);

  const resetData = () => {
    setPageNumber(0);
    setMovieSeries([]);
  };

  const toggleMovieSeries = (e) => {
    dispatch(setIsMovie(e.target.textContent === 'Movie' ? true : false));
    resetData();
  };

  const toggleReleasedUpcoming = (e) => {
    setReleased(e.target.textContent === 'Released' ? true : false);
    resetData();
  };

  const toggleLanguage = (e) => {
    const languageCode = {
      English: 'en',
      Hindi: 'hi',
      Tamil: 'ta',
      Telugu: 'te',
      Kannada: 'kn',
      Malayalam: 'ml',
    };

    setLanguage(languageCode[e.target.textContent]);
    resetData();
  };

  const toggleSortBy = (e) => {
    const sortOption = {
      'Popularity Ascending': 'popularity.asc',
      'Popularity Descending': 'popularity.desc',
      'Rating Ascending': 'vote_average.asc',
      'Rating Descending': 'vote_average.desc',
      'Release Date Ascending': 'release_date.asc',
      'Release Date Descending': 'release_date.desc',
      'Title (A-Z)': 'original_title.asc',
    };
    setSortby(sortOption[e.target.textContent]);
    resetData();
  };

  const toggleGenres = (genreID) => {
    setFilterByGenre((prevGenres) =>
      prevGenres.includes(genreID) ? prevGenres.filter((id) => id !== genreID) : [...prevGenres, genreID]
    );
    resetData();
  };

  return (
    <div className="movie-card-container">
      <div className="list-heading-copy">
        <div className="discover-filters">
          <h3>Discover</h3>
          <div className="paste-button">
            <button className="dropdown-button">{isMovie ? 'Movie' : 'Series'} &nbsp; ▼</button>
            <div className="dropdown-content">
              <li onClick={toggleMovieSeries}>Movie</li>
              <li onClick={toggleMovieSeries}>Series</li>
            </div>
          </div>
          <div className="paste-button">
            <button className="dropdown-button">{released ? 'Released' : 'Upcoming'} &nbsp; ▼</button>
            <div className="dropdown-content">
              <li onClick={toggleReleasedUpcoming}>Released</li>
              <li onClick={toggleReleasedUpcoming}>Upcoming</li>
            </div>
          </div>
          <div className="paste-button">
            <button className="dropdown-button">language: {language.toUpperCase()} &nbsp; ▼</button>
            <div className="dropdown-content">
              <li onClick={toggleLanguage}>English</li>
              <li onClick={toggleLanguage}>Hindi</li>
              <li onClick={toggleLanguage}>Tamil</li>
              <li onClick={toggleLanguage}>Telugu</li>
              <li onClick={toggleLanguage}>Kannada</li>
              <li onClick={toggleLanguage}>Malayalam</li>
            </div>
          </div>
          <div className="paste-button">
            <button className="dropdown-button">Sort By &nbsp; ▼</button>
            <div className="dropdown-content">
              <li onClick={toggleSortBy}>Popularity Ascending</li>
              <li onClick={toggleSortBy}>Popularity Descending</li>
              <li onClick={toggleSortBy}>Rating Ascending</li>
              <li onClick={toggleSortBy}>Rating Descending</li>
              <li onClick={toggleSortBy}>Release Date Ascending</li>
              <li onClick={toggleSortBy}>Release Date Descending</li>
              <li onClick={toggleSortBy}>Title (A-Z)</li>
            </div>
          </div>
        </div>
      </div>
      <ul className="genre-list">
        {genres.map((genre) => (
          <li
            key={genre.id}
            onClick={() => toggleGenres(genre.id)}
            style={{
              backgroundColor: filterByGenre.includes(genre.id) ? 'gray' : 'black',
              color: filterByGenre.includes(genre.id) ? 'black' : 'white',
            }}
          >
            {genre.name}
          </li>
        ))}
      </ul>
      <CardList movies={movieSeries} />

      <div className="loader" ref={loadingRef} />
    </div>
  );
}
