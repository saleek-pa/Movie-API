import React, { useState } from "react";
import { MDBIcon } from "mdb-react-ui-kit";
import { useNavigate } from "react-router-dom";
import axios from "../../Configs/Axios";
import toast from "react-hot-toast";
import "./Navbar.css";

export const Navbar = () => {
   const [searchTerm, setSearchTerm] = useState("");
   const [suggestions, setSuggestions] = useState([]);
   const navigate = useNavigate();

   const handleSearchInput = async (event) => {
      try {
         const value = event.target.value;
         setSearchTerm(value);

         if (searchTerm !== "") {
            const response = await axios.get(
               `https://api.themoviedb.org/3/search/multi?query=${searchTerm}&include_adult=true`
            );
            setSuggestions(response.data.results.filter((data) => data.media_type !== "person").slice(0, 5));
         } else setSuggestions([]);
      } catch (error) {
         console.error(error);
      }
   };

   const handleSuggestionClick = (type, id, title) => {
      setSearchTerm("");
      navigate(`/${type}/${id}-${title.toLowerCase().replace(/\s+/g, "-")}`);
   };

   return (
      <div className="navbar">
         <div className="search-input-container">
            <input
               type="text"
               name="text"
               className="search-input"
               placeholder="search..."
               value={searchTerm}
               onChange={handleSearchInput}
            />
            <MDBIcon fas icon="search" className="search-icon" />
            {searchTerm && (
               <ul className="suggestions-list">
                  {suggestions.map((data) => (
                     <li
                        key={data.id}
                        onClick={() =>
                           handleSuggestionClick(
                              data.media_type,
                              data.id,
                              data.media_type === "movie" ? data.title : data.name
                           )
                        }
                     >
                        <img
                           src={
                              data.poster_path
                                 ? `https://image.tmdb.org/t/p/w200${data.poster_path}`
                                 : "https://www.tgv.com.my/assets/images/404/movie-poster.jpg"
                           }
                           alt={data.title || data.name}
                           className="search-movie-image"
                        />
                        {data.title || data.name} (
                        {data.media_type === "movie"
                           ? data.release_date.split("-")[0]
                           : data.first_air_date.split("-")[0]}
                        )
                     </li>
                  ))}
               </ul>
            )}
         </div>

         <div className="navbar-right-section">
            <MDBIcon
               fas
               icon="bell"
               onClick={() =>
                  toast("It's not yet implemented. Stay tuned!", {
                     duration: 3000,
                  })
               }
            />
            <MDBIcon
               fas
               icon="user-circle"
               onClick={() =>
                  toast("It's not yet implemented. Stay tuned!\nBut you can still use all functionalities :).                  ", {
                     duration: 5000,
                  })
               }
            />
         </div>
      </div>
   );
};
