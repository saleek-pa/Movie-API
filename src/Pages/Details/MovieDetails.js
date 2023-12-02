import React, { useEffect, useState } from "react";
import axios from "../../Configs/Axios";
import { Navbar } from "../../Components/Navbar/Navbar";
import { MDBIcon } from "mdb-react-ui-kit";
import { useParams } from "react-router-dom";
import useMovieCardList from "../../Hooks/useMovieCardList";
import "./Details.css";

export default function MovieDetails() {
   const { id } = useParams();
   const [movie, setMovie] = useState({});
   const [trailer, setTrailer] = useState(null);
   const [similar, setSimilar] = useState([]);

   const runtime = movie.runtime;
   const hour = Math.floor(runtime / 60);
   const minute = runtime % 60;

   useEffect(() => {
      const fetchData = async () => {
         try {
            const response = await axios.get(`https://api.themoviedb.org/3/movie/${id}?append_to_response=credits,videos`);
            setMovie(response.data);
            setTrailer(response.data.videos.results.find((trailer) => trailer.name === "Official Trailer"));
            const similar = await axios.get(`https://api.themoviedb.org/3/movie/${id}/recommendations`);
            setSimilar(similar.data.results);
         } catch (error) {
            console.error(error);
         }
      };

      fetchData();
   }, [id, setMovie]);

   const SimilarMovies = useMovieCardList(similar, "Similar Movies");

   console.log(trailer)

   return (
      <div className="main-content-container">
         <Navbar />

         <div className="movie-details-container">
            <div className="movie-details-image-container">
               <img
                  src={
                     movie.poster_path
                        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                        : "https://www.tgv.com.my/assets/images/404/movie-poster.jpg"
                  }
                  alt={movie.title}
                  className="movie-details-image"
               />
               <div className="details-button-container">
                  <button
                     className="watch-button"
                     onClick={() => trailer && window.open(`https://www.youtube.com/watch?v=${trailer.key}`, "_blank")}
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
                  {movie.title} ({movie.release_date ? movie.release_date.split("-")[0] : ""})
                  <span className="movie-runtime">
                     {hour}h {minute}m
                  </span>
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
                              src={
                                 actor.profile_path
                                    ? `https://image.tmdb.org/t/p/w200${actor.profile_path}`
                                    : "https://static.vecteezy.com/system/resources/previews/005/337/799/non_2x/icon-image-not-found-free-vector.jpg"
                              }
                              alt={actor.name}
                              className="cast-image"
                           />
                           <p className="cast-name">{actor.name}</p>
                           {/* <p className="cast-character-name">{actor.character}</p> */}
                        </div>
                     ))}
               </div>
            </div>
         </div>
         <SimilarMovies />
      </div>
   );
}
