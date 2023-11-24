import React, { useEffect, useState } from "react";
import axios from "../../Configs/Axios";
import { Sidebar } from "../../Components/Sidebar/Sidebar";
import { Navbar } from "../../Components/Navbar/Navbar";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "./ViewMore.css";

export default function ViewMoreMovie() {
   const { title } = useParams();
   console.log(title);
   const navigate = useNavigate();
   const [movies, setMovies] = useState([]);

   useEffect(() => {
      const fetchData = async () => {
         try {
            let endpoint = "";

            switch (title) {
               case "trending-now":
                  endpoint = "https://api.themoviedb.org/3/trending/movie/day";
                  break;
               case "now-playing":
                  endpoint = "https://api.themoviedb.org/3/movie/now_playing";
                  break;
               case "upcoming":
                  endpoint = "https://api.themoviedb.org/3/movie/upcoming";
                  break;
               case "top-rated":
                  endpoint = "https://api.themoviedb.org/3/movie/top_rated";
                  break;
               default:
                  break;
            }

            const response = await axios.get(endpoint);
            console.log(response);
            setMovies(response.data.results);
         } catch (error) {
            console.error(error);
         }
      };

      fetchData();
   }, [title]);

   const heading = title
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

   return (
      <div className="home-container">
         <Sidebar />
         <div className="main-content-container">
            <Navbar />

            <div className="movie-card-container">
               <div className="list-heading">
                  <h3>{heading}</h3>
                  <button className="cta">
                     <span className="hover-underline-animation" onClick={() => navigate(`/movie/discover/${title}`)}>
                        View more
                     </span>
                  </button>
               </div>
               <div className="movie-card-list">
                  {movies.map((movie) => (
                     <div
                        className="movie-card"
                        key={movie.id}
                        onClick={() => navigate(`/movie/${movie.id}-${movie.title.toLowerCase().replace(/\s+/g, "-")}`)}
                     >
                        <img
                           src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                           alt={movie.title}
                           className="movie-image"
                        />
                        <div className="movie-title">
                           {movie.title} ({movie.release_date.split("-")[0]})
                        </div>
                        <div className="movie-review">{movie.vote_average.toFixed(1)}</div>
                     </div>
                  ))}
               </div>
            </div>
         </div>
      </div>
   );
}
