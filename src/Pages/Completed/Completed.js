import React, { useEffect, useState } from 'react';
import axios from '../../Configs/Axios';
import { dates } from '../../Redux/utils';
import { CardList } from '../../Components/MovieCardList/MovieCardList';
import { setIsMovie } from '../../Redux/movieSlice';
import { useDispatch, useSelector } from 'react-redux';
import '../ViewMore/ViewMore.css';

export default function Completed() {
  const user = useSelector((state) => state.user);
  const isMovie = useSelector((state) => state.user.isMovie);
  const [completed, setCompleted] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const ids = isMovie
          ? user.completed.movies.map((movie) => movie.id)
          : user.completed.series.map((series) => series.id);
        const details = await Promise.all(
          ids.map((id) =>
            axios
              .get(`https://api.themoviedb.org/3/${isMovie ? 'movie' : 'tv'}/${id}`)
              .then((response) => response.data)
              .catch((error) => console.error(error))
          )
        );
        const releaseDateKey = isMovie ? 'release_date' : 'first_air_date';
        setCompleted(details.filter((movie) => movie[releaseDateKey] <= dates[0]));
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [isMovie, user]);

  const returning = completed.filter((series) => series.status === 'Returning Series');
  const ended = completed.filter((series) => series.status === 'Ended' || 'Canceled');

  const toggleMovieSeries = (e) => {
    dispatch(setIsMovie(e.target.textContent === 'Movie' ? true : false));
  };

  return (
    <div className="movie-card-container">
      <div className="list-heading-copy">
        <div className="discover-filters" style={{ marginBottom: '15px' }}>
          <h3>Completed</h3>
          <div className="paste-button">
            <button className="dropdown-button">{isMovie ? 'Movie' : 'Series'} &nbsp; ▼</button>
            <div className="dropdown-content">
              <li onClick={toggleMovieSeries}>Movie</li>
              <li onClick={toggleMovieSeries}>Series</li>
            </div>
          </div>
        </div>
      </div>
      {isMovie ? (
        <CardList movies={completed} />
      ) : (
        <>
          {returning.length > 0 && (
            <div className="list-heading">
              <h3>Returning Series</h3>
            </div>
          )}
          <CardList movies={returning} />
          <div className="movie-card-container">
            {ended.length > 0 && (
              <div className="list-heading">
                <h3>Ended</h3>
              </div>
            )}
            <CardList movies={ended} />
          </div>
        </>
      )}
      {completed.length === 0 && <h3 className="text-center text-muted">Its empty!</h3>}
    </div>
  );
}
