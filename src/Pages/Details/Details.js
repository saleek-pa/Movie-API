import React, { useEffect, useState } from "react";
import axios from "../../Configs/Axios";
import { useParams } from "react-router-dom";
import { Sidebar } from "../../Components/Sidebar/Sidebar";
import { Navbar } from "../../Components/Navbar/Navbar";
import { MDBIcon } from "mdb-react-ui-kit";
import { useMovieCardList } from "../../Hooks/useMovieCardList";
import "./Details.css";

export const Details = () => {
   const { id } = useParams();
   const [movie, setMovie] = useState([]);
   const [similar, setSimilar] = useState([]);

   useEffect(() => {
      const fetchData = async () => {
         try {
            const response = await axios.get(`https://api.themoviedb.org/3/movie/${id}?append_to_response=credits`);
            setMovie(response.data);
            const similar = await axios.get(`https://api.themoviedb.org/3/movie/${id}/similar`);
            setSimilar(similar.data.results.slice(0, 6));
         } catch (error) {
            console.error(error);
         }
      };

      fetchData();
   }, [id, setMovie]);

   const SimilarMovies = useMovieCardList(similar, "Similar Movies");

   return (
      <div className="home-container">
         <Sidebar />
         <div className="main-content-container">
            <Navbar />

            <div className="movie-details-container">
               <div className="movie-details-image-container">
                  <img
                     src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                     alt={movie.title}
                     className="movie-details-image"
                  />
               </div>
               <div className="movie-details-right">
                  <h1 className="movie-details-title">
                     {movie.title} ({movie.release_date ? movie.release_date.split("-")[0] : ""})
                  </h1>

                  <div className="movie-details-genre">
                     {movie.genres && movie.genres.map((genre) => <p key={genre.id}>{genre.name}</p>)}
                  </div>

                  <p className="movie-details-plot">{movie.overview}</p>
                  <p className="movie-details-cast">Cast:</p>
                  <div className="cast-list-container">
                     {movie.credits &&
                        movie.credits.cast.map((actor) => (
                           <div className="cast-list-card" key={actor.id}>
                              <img
                                 src={`https://image.tmdb.org/t/p/w200${actor.profile_path}`}
                                 alt={actor.name}
                                 className="cast-image"
                              />
                              <p className="cast-name">{actor.name}</p>
                           </div>
                        ))}
                  </div>

                  <button className="watch-button">
                     <MDBIcon fas icon="play" className="me-2" />
                     Watch Trailer
                  </button>
                  <button className="add-list-button">
                     <MDBIcon fas icon="plus" className="me-2" />
                     Add to Watchlist
                  </button>
               </div>
            </div>
            <SimilarMovies />
         </div>
      </div>
   );
};
