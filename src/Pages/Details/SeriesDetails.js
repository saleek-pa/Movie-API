import React, { useEffect, useState } from "react";
import axios from "../../Configs/Axios";
import { useParams } from "react-router-dom";
import { Navbar } from "../../Components/Navbar/Navbar";
import { MDBIcon } from "mdb-react-ui-kit";
import useMovieCardList from "../../Hooks/useMovieCardList";
import "./Details.css";

export default function SeriesDetails() {
   const { id } = useParams();
   const [series, setSeries] = useState([]);
   const [similar, setSimilar] = useState([]);
   const [seasonDetails, setSeasonDetails] = useState([]);
   const [selectedSeasonId, setSelectedSeasonId] = useState(false);
   const [trailer, setTrailer] = useState(null);

   const [seasonChecked, setSeasonChecked] = useState([]);
   const [episodeChecked, setEpisodeChecked] = useState([]);
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

   const handleSeasonClick = (seasonId) => {
      setSelectedSeasonId(selectedSeasonId === seasonId ? null : seasonId);
   };

   const handleSeasonCheckbox = (seasonId) => {
      const season = seasonDetails.find((season) => season.id === seasonId);
      if (seasonChecked.includes(seasonId)) {
         setSeasonChecked(seasonChecked.filter((id) => id !== seasonId));
         setEpisodeChecked(episodeChecked.filter((epId) => !season.episodes.map((ep) => ep.id).includes(epId)));
      } else {
         setSeasonChecked([...seasonChecked, seasonId]);
         setEpisodeChecked([...episodeChecked, ...season.episodes.map((ep) => ep.id)]);
      }
   };

   const handleEpisodeCheckbox = (seasonId, episodeId) => {
      const season = seasonDetails.find((season) => season.id === seasonId);

      if (episodeChecked.includes(episodeId)) {
         episodeChecked.splice(episodeChecked.indexOf(episodeId), 1);
      } else {
         episodeChecked.push(episodeId);
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

   return (
      <div className="main-content-container">
         <Navbar />

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
               <div className="details-button-container">
                  <button
                     className="watch-button"
                     onClick={() => window.open(`https://www.youtube.com/watch?v=${trailer.key}`, "_blank")}
                  >
                     <MDBIcon fas icon="play" className="me-2" />
                     Trailer
                  </button>
                  <button className="add-list-button">
                     <MDBIcon fas icon="plus" className="me-2" />
                     Watchlist
                  </button>
               </div>
            </div>
            <div className="movie-details-right">
               <h1 className="movie-details-title">
                  {series.name} ({series.first_air_date ? series.first_air_date.split("-")[0] : ""})
               </h1>

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
                           <div className="progress" style={{ width: `${calculateSeasonProgress(value.id)}%` }}></div>
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
                                 <h5>{ep.name}</h5>
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
         <SimilarMovies />
      </div>
   );
}
