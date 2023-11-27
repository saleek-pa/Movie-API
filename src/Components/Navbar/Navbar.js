import React, { useContext, useState } from "react";
import { movies } from "../../DummyData";
import { MDBIcon } from "mdb-react-ui-kit";
import { useNavigate } from "react-router-dom";
import { MovieContext } from "../../App";
import "./Navbar.css";

export const Navbar = () => {
   const navigate = useNavigate();
   const { isMovie, setIsMovie } = useContext(MovieContext);
   const [searchTerm, setSearchTerm] = useState("");
   const [suggestions, setSuggestions] = useState([]);

   const toggleMovieSeries = (e) => {
      const button = e.target.textContent;
      setIsMovie(button === "Movie" ? true : false);
      isMovie ? navigate("/movie") : navigate("/tv");
   };

   const handleInputChange = (event) => {
      const value = event.target.value;
      setSearchTerm(value);

      if (value === "") {
         setSuggestions([]);
      } else {
         const filteredSuggestions = movies.filter((item) => item.title.toLowerCase().includes(value.toLowerCase()));
         setSuggestions(filteredSuggestions.slice(0, 3));
      }
   };

   const handleSuggestionClick = (title) => {
      setSearchTerm("");
      navigate(`/movie/${title}`);
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
               onChange={handleInputChange}
            />
            <MDBIcon fas icon="search" className="search-icon" />
            {searchTerm && (
               <ul className="suggestions-list">
                  {suggestions.map((suggestion, index) => (
                     <li key={index} onClick={() => handleSuggestionClick(suggestion.title)}>
                        <img src={suggestion.image} alt={suggestion.title} className="search-movie-image" />
                        {suggestion.title} ({suggestion.year})
                     </li>
                  ))}
               </ul>
            )}
         </div>
         <div className="navbar-right-section">
            <div>
               <button className="navbar-movie-series" onClick={toggleMovieSeries}>
                  Movie
               </button>
               <button className="navbar-movie-series" onClick={toggleMovieSeries}>
                  Series
               </button>
            </div>
            <div>
               <button className="sign-up-btn">
                  Sign up
                  <span>
                     <MDBIcon fas icon="angle-right" />
                  </span>
               </button>
            </div>
         </div>
      </div>
   );
};
