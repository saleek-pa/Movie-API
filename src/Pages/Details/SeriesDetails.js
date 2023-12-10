import React, { useContext, useEffect, useState } from "react";
import axios from "../../Configs/Axios";
import { Navbar } from "../../Components/Navbar/Navbar";
import { MDBIcon } from "mdb-react-ui-kit";
import { MovieContext } from "../../App";
import { MovieDetailsLoading } from "../../Components/SkeletonLoading/SkeletonLoading";
import { useNavigate, useParams } from "react-router-dom";
import useMovieCardList from "../../Hooks/useMovieCardList";
import toast from "react-hot-toast";
import "./Details.css";

export default function SeriesDetails() {
   const { id } = useParams();
   const { user, setUser, dates } = useContext(MovieContext);
   const [series, setSeries] = useState([]);
   const [similar, setSimilar] = useState([]);
   const [seasonDetails, setSeasonDetails] = useState([]);
   const [selectedSeasonId, setSelectedSeasonId] = useState(false);
   const [trailer, setTrailer] = useState(null);
   const navigate = useNavigate();

   const [seasonChecked, setSeasonChecked] = useState(user.season);
   const [episodeChecked, setEpisodeChecked] = useState(user.episode);
   let completedEpisodes = 0;

   useEffect(() => {
      const fetchData = async () => {
         try {
            const response = await axios.get(`https://api.themoviedb.org/3/tv/${id}?append_to_response=credits,videos`);
            setSeries(response.data);
            setTrailer(response.data.videos.results.find((trailer) => trailer.name === "Official Trailer"));
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

   const handleWatchlistClick = (seriesId) => {
      setUser((prevUser) => ({
         ...prevUser,
         watchlist: {
            ...prevUser.watchlist,
            series: [...prevUser.watchlist.series, seriesId],
         },
      }));
      toast.success("Added to Watchlist");
   };

   const removeFromWatchlist = (seriesId) => {
      setUser((prevUser) => ({
         ...prevUser,
         watchlist: {
            ...prevUser.watchlist,
            series: prevUser.watchlist.series.filter((id) => id !== seriesId),
         },
      }));
      toast("Removed from watchlist");
   };

   const handleCompletedClick = (seriesId) => {
      setUser((prevUser) => ({
         ...prevUser,
         completed: {
            ...prevUser.completed,
            series: [...prevUser.completed.series, { id: seriesId, rating: 1 }],
         },
         watchlist: {
            ...prevUser.watchlist,
            series: prevUser.watchlist.series.filter((id) => id !== seriesId),
         },
      }));
      toast.success("Marked as watched");
   };

   const handleRatingChange = (seriesId, rating) => {
      setUser((prevUser) => ({
         ...prevUser,
         completed: {
            ...prevUser.completed,
            series: prevUser.completed.series.map((series) =>
               series.id === seriesId ? { ...series, rating } : series
            ),
         },
      }));
      toast("We'll recommend series\nbased on your rating.");
   };

   const handleSeasonClick = (seasonId) => {
      setSelectedSeasonId(selectedSeasonId === seasonId ? null : seasonId);
   };

   const handleSeasonCheckbox = (seasonId) => {
      const season = seasonDetails.find((season) => season.id === seasonId);
      if (seasonChecked.includes(seasonId)) {
         setSeasonChecked(seasonChecked.filter((id) => id !== seasonId));
         setUser((prevUser) => ({
            ...prevUser,
            season: prevUser.season.filter((id) => id !== seasonId),
            episode: prevUser.episode.filter((epId) => !season.episodes.map((ep) => ep.id).includes(epId)),
         }));
         setEpisodeChecked(episodeChecked.filter((epId) => !season.episodes.map((ep) => ep.id).includes(epId)));
      } else {
         setSeasonChecked([...seasonChecked, seasonId]);
         setUser((prevUser) => ({
            ...prevUser,
            season: [...prevUser.season, seasonId],
            episode: [...prevUser.episode, ...season.episodes.map((ep) => ep.id)],
         }));
         setEpisodeChecked([...episodeChecked, ...season.episodes.map((ep) => ep.id)]);
      }
   };

   const handleEpisodeCheckbox = (seasonId, episodeId) => {
      const season = seasonDetails.find((season) => season.id === seasonId);

      if (episodeChecked.includes(episodeId)) {
         episodeChecked.splice(episodeChecked.indexOf(episodeId), 1);
         setUser((prevUser) => ({
            ...prevUser,
            episode: prevUser.episode.filter((id) => id !== episodeId),
         }));
      } else {
         episodeChecked.push(episodeId);
         setUser((prevUser) => ({
            ...prevUser,
            episode: [...prevUser.episode, episodeId],
         }));
      }

      if (season.episodes.every((ep) => episodeChecked.includes(ep.id))) {
         setSeasonChecked([...seasonChecked, seasonId]);
      } else {
         setSeasonChecked(seasonChecked.filter((id) => id !== seasonId));
      }
   };

   const calculateSeasonProgress = (seasonId) => {
      const season = seasonDetails.find((season) => season.id === seasonId);
      const totalEpisodes = season.episodes.length;
      completedEpisodes = season.episodes.filter((ep) => episodeChecked.includes(ep.id)).length;
      return (completedEpisodes / totalEpisodes) * 100;
   };

   const dateConverter = (date) => {
      const dateToConvert = new Date(date);
      const options = { year: "numeric", month: "long", day: "numeric" };
      const formattedDate = new Intl.DateTimeFormat("en-US", options).format(dateToConvert);
      return formattedDate;
   };

   const SimilarMovies = useMovieCardList(similar, "Similar Series");

   const episodeRuntime = (runtime) => {
      if (runtime === null) return "";

      const hour = Math.floor(runtime / 60);
      const minute = runtime % 60;
      const formattedRuntime = `${hour}h ${minute}m`;
      return formattedRuntime;
   };

   return (
      <div className="main-content-container">
         <Navbar />

         {series.poster_path ? (
            <>
               <div className="movie-details-container">
                  <div className="movie-details-image-container">
                     <img
                        src={
                           series.poster_path
                              ? `https://image.tmdb.org/t/p/w500${series.poster_path}`
                              : "https://www.tgv.com.my/assets/images/404/movie-poster.jpg"
                        }
                        alt={series.title}
                        className="movie-details-image"
                     />
                     {userWatchlist.includes(series.id) && (
                        <MDBIcon
                           fas
                           icon="heart"
                           className="details-watchlist-toggle"
                           onClick={() => removeFromWatchlist(series.id)}
                        />
                     )}
                     <div className="details-button-container">
                        <button
                           className="watch-button"
                           onClick={() => window.open(`https://www.youtube.com/watch?v=${trailer.key}`, "_blank")}
                        >
                           <MDBIcon fas icon="play" className="me-2" />
                           Trailer
                        </button>
                        {userWatchlist &&
                           !userWatchlist.includes(series.id) &&
                           !userCompleted.some((value) => value.id === series.id) && (
                              <button className="add-list-button" onClick={() => handleWatchlistClick(series.id)}>
                                 <MDBIcon fas icon="plus" className="me-2" />
                                 Watchlist
                              </button>
                           )}
                        {userWatchlist && userWatchlist.includes(series.id) && (
                           <button
                              className="add-list-button"
                              onClick={() => {
                                 series.last_episode_to_air !== null
                                    ? series.last_episode_to_air.air_date <= dates[0]
                                       ? handleCompletedClick(series.id)
                                       : toast("Series not released")
                                    : toast("Series not released");
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
                                 onChange={() => handleRatingChange(series.id, 3)}
                              />
                              <label htmlFor="star3"></label>
                              <input
                                 value="2"
                                 name="rating"
                                 id="star2"
                                 type="radio"
                                 checked={userCompleted.some((value) => value.id === series.id && value.rating === 2)}
                                 onChange={() => handleRatingChange(series.id, 2)}
                              />
                              <label htmlFor="star2"></label>
                              <input
                                 value="1"
                                 name="rating"
                                 id="star1"
                                 type="radio"
                                 checked={userCompleted.some((value) => value.id === series.id && value.rating === 0)}
                                 onChange={() => handleRatingChange(series.id, 0)}
                              />
                              <label htmlFor="star1"></label>
                           </div>
                        )}
                     </div>
                  </div>
                  <div className="movie-details-right">
                     <h1 className="movie-details-title">
                        {series.name} ({series.first_air_date ? series.first_air_date.split("-")[0] : ""})
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
                                          : "https://static.vecteezy.com/system/resources/previews/005/337/799/non_2x/icon-image-not-found-free-vector.jpg"
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
               <div className="series-season-container">
                  {seasonDetails.map((value) => (
                     <div key={value.id}>
                        <div className="season-row">
                           <div className="checkbox-wrapper">
                              <input
                                 id={`${value.id}`}
                                 type="checkbox"
                                 checked={seasonChecked.includes(value.id)}
                                 onChange={() => handleSeasonCheckbox(value.id)}
                              />
                              <label htmlFor={`${value.id}`}>
                                 <div className="tick_mark"></div>
                              </label>
                           </div>
                           <div className="season-row-copy" onClick={() => handleSeasonClick(value.id)}>
                              <h4 style={{ margin: "0" }}>Season {value.season_number}</h4>
                              <div className="progress-loader">
                                 <div
                                    className="progress"
                                    style={{ width: `${calculateSeasonProgress(value.id)}%` }}
                                 ></div>
                              </div>
                              <h5 style={{ margin: "0" }}>
                                 {completedEpisodes}/{value.episodes.length}
                              </h5>
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
                                                : ""}
                                          </span>
                                       </h5>
                                       <div style={{ display: "flex" }}>
                                          <p style={{ margin: "0" }}>
                                             S0{ep.season_number}E0{ep.episode_number}
                                          </p>
                                          &nbsp;·&nbsp;<p style={{ margin: "0" }}>{dateConverter(ep.air_date)}</p>
                                       </div>
                                    </div>
                                    <div className="checkbox-wrapper">
                                       <input
                                          id={`${value.id}-${ep.id}`}
                                          type="checkbox"
                                          checked={episodeChecked.includes(ep.id)}
                                          onChange={() => handleEpisodeCheckbox(value.id, ep.id)}
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
                  <h6 className="series-status">{(series.status || "").toUpperCase()}</h6>
               </div>
            </>
         ) : (
            <MovieDetailsLoading />
         )}
         {similar.length > 0 && <SimilarMovies />}
      </div>
   );
}
