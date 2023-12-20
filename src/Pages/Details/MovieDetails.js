import React, { useContext, useEffect, useState } from "react";
import axios from "../../Configs/Axios";
import { Navbar } from "../../Components/Navbar/Navbar";
import { MDBIcon } from "mdb-react-ui-kit";
import { useDispatch } from "react-redux";
import { MovieContext } from "../../App";
import { MovieDetailsLoading } from "../../Components/SkeletonLoading/SkeletonLoading";
import { useNavigate, useParams } from "react-router-dom";
import { handleWatchlistClick, handleCompletedClick, handleRatingChange } from "../../Redux/movieSlice";
import useMovieCardList from "../../Hooks/useMovieCardList";
import toast from "react-hot-toast";
import "./Details.css";

export default function MovieDetails() {
   const { id } = useParams();
   const [movie, setMovie] = useState({});
   const [trailer, setTrailer] = useState(null);
   const [similar, setSimilar] = useState([]);
   const navigate = useNavigate();
   const dispatch = useDispatch();

   useEffect(() => {
      const fetchData = async () => {
         try {
            const response = await axios.get(
               `https://api.themoviedb.org/3/movie/${id}?append_to_response=credits,videos`
            );
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

   const { user } = useContext(MovieContext);
   const userWatchlist = user?.watchlist?.movies;
   const userCompleted = user?.completed?.movies;

   const runtime = movie.runtime;
   const hour = Math.floor(runtime / 60);
   const minute = runtime % 60;

   return (
      <div className="main-content-container">
         <Navbar />
         {movie.poster_path ? (
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
                  {userWatchlist.includes(movie.id) && (
                     <MDBIcon
                        fas
                        icon="heart"
                        className="details-watchlist-toggle"
                        onClick={() => {
                           toast("Removed from watchlist");
                           dispatch(handleWatchlistClick({ id: movie.id, type: "movies" }));
                        }}
                     />
                  )}
                  <div className="details-button-container">
                     <button
                        className="watch-button"
                        onClick={() =>
                           trailer && window.open(`https://www.youtube.com/watch?v=${trailer.key}`, "_blank")
                        }
                     >
                        <MDBIcon fas icon="play" className="me-2" />
                        Trailer
                     </button>
                     {userWatchlist &&
                        !userWatchlist.includes(movie.id) &&
                        !userCompleted.some((value) => value.id === movie.id) && (
                           <button
                              className="add-list-button"
                              onClick={() => {
                                 toast.success("Added to watchlist");
                                 dispatch(handleWatchlistClick({ id: movie.id, type: "movies" }));
                              }}
                           >
                              <MDBIcon fas icon="plus" className="me-2" />
                              Watchlist
                           </button>
                        )}
                     {userWatchlist && userWatchlist.includes(movie.id) && (
                        <button
                           className="add-list-button"
                           onClick={() => {
                              if (movie.status === "Released") {
                                 toast.success("Marked as watched");
                                 dispatch(handleCompletedClick({ id: movie.id, type: "movies" }));
                              } else toast("Movie not released");
                           }}
                        >
                           <MDBIcon fas icon="check" className="me-2" />
                           Watched
                        </button>
                     )}
                     {userWatchlist && userCompleted.some((value) => value.id === movie.id) && (
                        <div className="rating">
                           <input
                              value="3"
                              checked={userCompleted.some((value) => value.id === movie.id && value.rating === 3)}
                              name="rating"
                              id="star3"
                              type="radio"
                              onChange={() => dispatch(handleRatingChange({ id: movie.id, type: "movies", rating: 3 }))}
                           />
                           <label htmlFor="star3"></label>
                           <input
                              value="2"
                              name="rating"
                              id="star2"
                              type="radio"
                              checked={userCompleted.some((value) => value.id === movie.id && value.rating === 2)}
                              onChange={() => dispatch(handleRatingChange({ id: movie.id, type: "movies", rating: 2 }))}
                           />
                           <label htmlFor="star2"></label>
                           <input
                              value="1"
                              name="rating"
                              id="star1"
                              type="radio"
                              checked={userCompleted.some((value) => value.id === movie.id && value.rating === 0)}
                              onChange={() => dispatch(handleRatingChange({ id: movie.id, type: "movies", rating: 0 }))}
                           />
                           <label htmlFor="star1"></label>
                        </div>
                     )}
                  </div>
               </div>
               <div className="movie-details-right">
                  <h1 className="movie-details-title">
                     {movie.title} ({movie.release_date ? movie.release_date.split("-")[0] : ""})
                     <span className="movie-runtime">
                        {hour}h {minute}m
                     </span>
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
         ) : (
            <MovieDetailsLoading />
         )}
         {similar.length > 0 && <SimilarMovies />}
      </div>
   );
}
