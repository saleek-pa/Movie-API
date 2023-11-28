import React, { useEffect, useState } from "react";
import axios from "../../Configs/Axios";
import { useParams } from "react-router-dom";
import { Navbar } from "../../Components/Navbar/Navbar";
import { MDBIcon } from "mdb-react-ui-kit";
import useSeriesCardList from "../../Hooks/useSeriesCardList";
import "./Details.css";

export default function SeriesDetails() {
   const { id } = useParams();
   const [series, setSeries] = useState([]);
   const [similar, setSimilar] = useState([]);

   useEffect(() => {
      const fetchData = async () => {
         try {
            const response = await axios.get(`https://api.themoviedb.org/3/tv/${id}?append_to_response=credits`);
            setSeries(response.data);
            const similar = await axios.get(`https://api.themoviedb.org/3/tv/${id}/similar`);
            setSimilar(similar.data.results.slice(0, 6));
         } catch (error) {
            console.error(error);
         }
      };

      fetchData();
   }, [id, setSeries]);

   console.log(series);

   const SimilarMovies = useSeriesCardList(similar, "Similar Series");

   return (
      <div className="main-content-container">
         <Navbar />

         <div className="movie-details-container">
            <div className="movie-details-image-container">
               <img
                  src={`https://image.tmdb.org/t/p/w500${series.poster_path}`}
                  alt={series.title}
                  className="movie-details-image"
               />
               <div className="details-button-container">
                  <button className="watch-button">
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
                              src={`https://image.tmdb.org/t/p/w200${actor.profile_path}` || ""}
                              alt={actor.name}
                              className="cast-image"
                           />
                           <p className="cast-name">{actor.name}</p>
                        </div>
                     ))}
               </div>
            </div>
         </div>
         <SimilarMovies />
      </div>
   );
}