import React from "react";
import { useParams } from "react-router-dom";
import { movies } from "../../DummyData";
import { Sidebar } from "../../Components/Sidebar/Sidebar";
import { Navbar } from "../../Components/Navbar/Navbar";
import { MDBIcon } from "mdb-react-ui-kit";
import "./Details.css";
import { useMovieCardList } from "../../Hooks/useMovieCardList ";

export const Details = () => {
   const { title } = useParams();
   const movies1 = {
      plot: "When Earth becomes uninhabitable in the future, a farmer and ex-NASA pilot, Joseph Cooper, is tasked to pilot a spacecraft, along with a team of researchers, to find a new planet for humans.",
   };

   const cast = [
      {
         image: "https://m.media-amazon.com/images/M/MV5BNThiOTM4NTAtMDczNy00YzlkLWJhNTEtZTZhNDVmYzlkZWI0XkEyXkFqcGdeQXVyMTEyMjM2NDc2._V1_.jpg",
         name: "Timothée Chalamet",
      },
      {
         image: "https://m.media-amazon.com/images/M/MV5BODYwMzk0MTk5MV5BMl5BanBnXkFtZTgwNzMwNjM0NTE@._V1_FMjpg_UX1000_.jpg",
         name: "Rebecca Ferguson",
      },
      {
         image: "https://m.media-amazon.com/images/M/MV5BMjAxZTk4NDAtYjI3Mi00OTk3LTg0NDEtNWFlNzE5NDM5MWM1XkEyXkFqcGdeQXVyOTI3MjYwOQ@@._V1_.jpg",
         name: "Zendaya",
      },
      {
         image: "https://m.media-amazon.com/images/M/MV5BYjMyZjc0MzQtMTVhMy00MDI2LWJiZmItNjM5NjcwNjA5NmEyXkEyXkFqcGdeQXVyMzk0NzQ5MjU@._V1_.jpg",
         name: "Jason Momoa",
      },
      {
         image: "https://m.media-amazon.com/images/M/MV5BMTQ2ODE2NDQ5OF5BMl5BanBnXkFtZTcwOTU3OTM1OQ@@._V1_FMjpg_UX1000_.jpg",
         name: "Oscar Isaac",
      },
   ];

   const movie = movies.find((movie) => movie.title === title);
   let { plot } = movies1;
   return (
      <div className="home-container">
         <Sidebar />
         <div className="main-content-container">
            <Navbar />

            <div className="movie-details-container">
               <div className="movie-details-image-container">
                  <img src={movie.image} alt={movie.title} className="movie-details-image" />
               </div>
               <div className="movie-details-right">
                  <h1 className="movie-details-title">
                     {movie.title} ({movie.year})
                  </h1>

                  <div className="movie-details-genre">
                     {["Adventure", "Drama", "Sci-Fi"].map((genre, index) => (
                        <p key={index}>{genre}</p>
                     ))}
                  </div>

                  <p className="movie-details-plot">{plot}</p>
                  <p className="movie-details-cast">Cast</p>
                  <div className="cast-list-container">
                     {cast.map((actor, index) => (
                        <div className="cast-list-card" key={index}>
                           <img src={actor.image} alt={actor.name} className="cast-image" />
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
            {useMovieCardList(movies, "Similar Movies")}
         </div>
      </div>
   );
};
