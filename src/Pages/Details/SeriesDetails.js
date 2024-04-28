import React, { useEffect, useState } from 'react';
import axios from '../../Configs/Axios';
import { MDBIcon } from 'mdb-react-ui-kit';
import { useDispatch, useSelector } from 'react-redux';
import { MovieDetailsLoading } from '../../Components/SkeletonLoading/SkeletonLoading';
import { useNavigate, useParams } from 'react-router-dom';
import { dates, dateConverter, episodeRuntime } from '../../Redux/utils';
import {
  handleWatchlistClick,
  handleCompletedClick,
  handleRatingChange,
  handleSeasonCheckbox,
  handleEpisodeCheckbox,
} from '../../Redux/movieSlice';
import toast from 'react-hot-toast';
import './Details.css';
import MovieList from '../../Components/MovieCardList/MovieList';

export default function SeriesDetails() {
  const { id } = useParams();
  const user = useSelector((state) => state.user);

  const [series, setSeries] = useState([]);
  const [similar, setSimilar] = useState([]);
  const [seasonDetails, setSeasonDetails] = useState([]);
  const [selectedSeasonId, setSelectedSeasonId] = useState(false);
  const [trailer, setTrailer] = useState(null);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [seasonChecked, setSeasonChecked] = useState(user.season);
  const [episodeChecked, setEpisodeChecked] = useState(user.episode);
  let completedEpisodes = 0;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`https://api.themoviedb.org/3/tv/${id}?append_to_response=credits,videos`);
        setSeries(response.data);
        setTrailer(response.data.videos.results.find((trailer) => trailer.name === 'Official Trailer'));
        const similar = await axios.get(`https://api.themoviedb.org/3/tv/${id}/recommendations`);
        setSimilar(similar.data.results);

        const totalSeason = response.data.number_of_seasons;
        const details = [];
        for (let i = 1; i <= totalSeason; i++) {
          const season = await axios.get(`https://api.themoviedb.org/3/tv/${id}/season/${i}`);
          details.push(season.data);
        }
        setSeasonDetails(details);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [id, setSeries]);

  const userWatchlist = user?.watchlist?.series;
  const userCompleted = user?.completed?.series;

  const handleSeasonClick = (seasonId) => {
    setSelectedSeasonId(selectedSeasonId === seasonId ? null : seasonId);
  };

  const calculateSeasonProgress = (seasonId) => {
    const season = seasonDetails.find((season) => season.id === seasonId);
    const totalEpisodes = season.episodes.length;
    completedEpisodes = season.episodes.filter((ep) => episodeChecked.includes(ep.id)).length;
    return (completedEpisodes / totalEpisodes) * 100;
  };

  return (
    <>
      {series.poster_path ? (
        <>
          <div className="movie-details-container">
            <div className="movie-details-image-container">
              <img
                src={
                  series.poster_path
                    ? `https://image.tmdb.org/t/p/w500${series.poster_path}`
                    : 'https://www.tgv.com.my/assets/images/404/movie-poster.jpg'
                }
                alt={series.title}
                className="movie-details-image"
              />
              {userWatchlist.includes(series.id) && (
                <MDBIcon
                  fas
                  icon="heart"
                  className="details-watchlist-toggle"
                  onClick={() => {
                    toast('Removed from watchlist');
                    dispatch(handleWatchlistClick({ id: series.id, type: 'series' }));
                  }}
                />
              )}
              <div className="details-button-container">
                <button
                  className="watch-button"
                  onClick={() => window.open(`https://www.youtube.com/watch?v=${trailer.key}`, '_blank')}
                >
                  <MDBIcon fas icon="play" className="me-2" />
                  Trailer
                </button>
                {userWatchlist &&
                  !userWatchlist.includes(series.id) &&
                  !userCompleted.some((value) => value.id === series.id) && (
                    <button
                      className="add-list-button"
                      onClick={() => {
                        toast.success('Added to watchlist');
                        dispatch(handleWatchlistClick({ id: series.id, type: 'series' }));
                      }}
                    >
                      <MDBIcon fas icon="plus" className="me-2" />
                      Watchlist
                    </button>
                  )}
                {userWatchlist && userWatchlist.includes(series.id) && (
                  <button
                    className="add-list-button"
                    onClick={() => {
                      if (series.last_episode_to_air !== null) {
                        if (series.last_episode_to_air.air_date <= dates[0]) {
                          toast.success('Marked as watched');
                          dispatch(handleCompletedClick({ id: series.id, type: 'series' }));
                        } else {
                          toast.error('Series not released');
                        }
                      } else {
                        toast.error('Series not released');
                      }
                    }}
                  >
                    <MDBIcon fas icon="check" className="me-2" />
                    Watched
                  </button>
                )}
                {userWatchlist && userCompleted.some((value) => value.id === series.id) && (
                  <div className="rating">
                    <input
                      value="3"
                      checked={userCompleted.some((value) => value.id === series.id && value.rating === 3)}
                      name="rating"
                      id="star3"
                      type="radio"
                      onChange={() => dispatch(handleRatingChange({ id: series.id, type: 'series', rating: 3 }))}
                    />
                    <label htmlFor="star3"></label>
                    <input
                      value="2"
                      name="rating"
                      id="star2"
                      type="radio"
                      checked={userCompleted.some((value) => value.id === series.id && value.rating === 2)}
                      onChange={() => dispatch(handleRatingChange({ id: series.id, type: 'series', rating: 2 }))}
                    />
                    <label htmlFor="star2"></label>
                    <input
                      value="1"
                      name="rating"
                      id="star1"
                      type="radio"
                      checked={userCompleted.some((value) => value.id === series.id && value.rating === 0)}
                      onChange={() => dispatch(handleRatingChange({ id: series.id, type: 'series', rating: 0 }))}
                    />
                    <label htmlFor="star1"></label>
                  </div>
                )}
              </div>
            </div>
            <div className="movie-details-right">
              <h1 className="movie-details-title">
                {series.name} ({series.first_air_date ? series.first_air_date.split('-')[0] : ''})
              </h1>

              <button
                className="details-close-button"
                onClick={(e) => {
                  e.preventDefault();
                  navigate(-1);
                }}
              >
                <span className="X"></span>
                <span className="Y"></span>
              </button>

              <div className="movie-details-genre">
                {series.genres && series.genres.map((genre) => <p key={genre.id}>{genre.name}</p>)}
              </div>

              <p className="movie-details-plot">{series.overview}</p>
              <p className="movie-details-cast">Cast:</p>
              <div className="cast-list-container">
                {series.credits &&
                  series.credits.cast.map((actor) => (
                    <div className="cast-list-card" key={actor.id}>
                      <img
                        src={
                          actor.profile_path
                            ? `https://image.tmdb.org/t/p/w200${actor.profile_path}`
                            : 'https://static.vecteezy.com/system/resources/previews/005/337/799/non_2x/icon-image-not-found-free-vector.jpg'
                        }
                        alt={actor.name}
                        className="cast-image"
                      />
                      <p className="cast-name">{actor.name}</p>
                    </div>
                  ))}
              </div>
            </div>
          </div>

          <div>
            {seasonDetails.map((value) => (
              <div key={value.id}>
                <div className="season-row">
                  <div className="checkbox-wrapper">
                    <input
                      id={`${value.id}`}
                      type="checkbox"
                      checked={seasonChecked.includes(value.id)}
                      onChange={() =>
                        dispatch(
                          handleSeasonCheckbox({
                            seasonId: value.id,
                            seasonDetails,
                            seasonChecked,
                            setSeasonChecked,
                            episodeChecked,
                            setEpisodeChecked,
                          })
                        )
                      }
                    />
                    <label htmlFor={`${value.id}`}>
                      <div className="tick_mark"></div>
                    </label>
                  </div>
                  <div className="season-row-copy" onClick={() => handleSeasonClick(value.id)}>
                    <h4>Season {value.season_number}</h4>
                    <div className="progress-loader">
                      <div className="progress" style={{ width: `${calculateSeasonProgress(value.id)}%` }}></div>
                    </div>
                    <h4>
                      {completedEpisodes}/{value.episodes.length}
                    </h4>
                    <MDBIcon fas icon="chevron-right" />
                  </div>
                </div>
                {selectedSeasonId === value.id && (
                  <div className="episode-dropdown">
                    {value.episodes.map((ep) => (
                      <div className="episode-list" key={ep.id}>
                        <div className="episode-left-side">
                          <h5>
                            {ep.name}
                            <span className="movie-runtime fs-6">
                              {ep.runtime !== null
                                ? ep.runtime < 60
                                  ? `${ep.runtime}m`
                                  : episodeRuntime(ep.runtime)
                                : ''}
                            </span>
                          </h5>
                          <div style={{ display: 'flex' }}>
                            <p style={{ margin: '0' }}>
                              S0{ep.season_number}E0{ep.episode_number}
                            </p>
                            &nbsp;·&nbsp;<p style={{ margin: '0' }}>{dateConverter(ep.air_date)}</p>
                          </div>
                        </div>
                        <div className="checkbox-wrapper">
                          <input
                            id={`${value.id}-${ep.id}`}
                            type="checkbox"
                            checked={episodeChecked.includes(ep.id)}
                            onChange={() =>
                              dispatch(
                                handleEpisodeCheckbox({
                                  seasonId: value.id,
                                  episodeId: ep.id,
                                  seasonDetails,
                                  episodeChecked,
                                  seasonChecked,
                                  setSeasonChecked,
                                })
                              )
                            }
                          />
                          <label htmlFor={`${value.id}-${ep.id}`}>
                            <div className="tick_mark"></div>
                          </label>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <h6 className="series-status">{(series.status || '').toUpperCase()}</h6>
          </div>
        </>
      ) : (
        <MovieDetailsLoading />
      )}
      {similar.length > 0 && <MovieList movies={similar} heading={'Similar Series'} />}
    </>
  );
}
