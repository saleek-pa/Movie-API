import React, { useEffect, useState } from 'react';
import axios from '../../Configs/Axios';
import { dates } from '../../Redux/utils';
import { CardList } from '../../Components/MovieCardList/MovieCardList';
import { setIsMovie } from '../../Redux/movieSlice';
import { useDispatch, useSelector } from 'react-redux';
import '../Discover/Discover.css';

export default function Watchlist() {
  const user = useSelector((state) => state.user);
  const isMovie = useSelector((state) => state.user.isMovie);

  const [watchlist, setWatchlist] = useState([]);
  const [released, setReleased] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const ids = isMovie ? user.watchlist.movies : user.watchlist.series;
        const details = await Promise.all(
          ids.map((id) =>
            axios
              .get(`https://api.themoviedb.org/3/${isMovie ? 'movie' : 'tv'}/${id}`)
              .then((response) => response.data)
              .catch((error) => console.error(error))
          )
        );
        const releaseDateKey = isMovie ? 'release_date' : 'first_air_date';
        setWatchlist(
          details.filter((movie) => (released ? movie[releaseDateKey] <= dates[0] : movie[releaseDateKey] >= dates[0]))
        );
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [isMovie, released, user]);

  const toggleMovieSeries = (e) => {
    dispatch(setIsMovie(e.target.textContent === 'Movie' ? true : false));
  };

  const toggleReleasedUpcoming = (e) => {
    setReleased(e.target.textContent === 'Released' ? true : false);
  };

  return (
    <div className="movie-card-container">
      <div className="list-heading-copy">
        <div className="discover-filters" style={{ marginBottom: '15px' }}>
          <h3>Watchlist</h3>
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
        </div>
      </div>

      <CardList movies={watchlist} />
      {watchlist.length === 0 && <h3 className="text-center text-muted">Its empty!</h3>}
    </div>
  );
}
