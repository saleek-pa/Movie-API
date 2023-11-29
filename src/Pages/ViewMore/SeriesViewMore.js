import React, { useEffect, useState } from "react";
import axios from "../../Configs/Axios";
import { Navbar } from "../../Components/Navbar/Navbar";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "./ViewMore.css";

export default function ViewMoreMovie() {
   const { title } = useParams();
   const navigate = useNavigate();
   const [series, setSeries] = useState([]);

   useEffect(() => {
      const fetchData = async () => {
         try {
            let endpoint = "";

            switch (title) {
               case "trending-now":
                  endpoint = "https://api.themoviedb.org/3/trending/tv/day";
                  break;
               case "now-playing":
                  endpoint = "https://api.themoviedb.org/3/tv/airing_today";
                  break;
               case "upcoming":
                  endpoint = "https://api.themoviedb.org/3/tv/on_the_air";
                  break;
               case "top-rated":
                  endpoint = "https://api.themoviedb.org/3/tv/top_rated";
                  break;
               default:
                  break;
            }

            const response = await axios.get(endpoint);
            setSeries(response.data.results);
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
      <div className="main-content-container">
         <Navbar />

         <div className="movie-card-container">
            <div className="list-heading">
               <h3>{heading}</h3>
               <button className="cta">
                  <span
                     className="hover-underline-animation"
                     onClick={() => navigate(`/tv/discover/${heading.toLowerCase().replace(" ", "-")}`)}
                  >
                     View more
                  </span>
               </button>
            </div>
            <div className="view-more-movie-card-list">
               {series.map((series) => (
                  <div
                     className="movie-card"
                     key={series.id}
                     onClick={() => navigate(`/tv/${series.id}-${series.name.toLowerCase().replace(/\s+/g, "-")}`)}
                  >
                     <img
                        src={`https://image.tmdb.org/t/p/w200${series.poster_path}`}
                        alt={series.name}
                        className="movie-image"
                     />
                     <div className="movie-title">
                        {series.name} ({series.first_air_date.split("-")[0]})
                     </div>
                     <div className="movie-review">{series.vote_average.toFixed(1)}</div>
                  </div>
               ))}
            </div>
         </div>
      </div>
   );
}
