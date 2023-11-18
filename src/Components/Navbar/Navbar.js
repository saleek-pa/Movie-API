import React, { useState } from "react";
import { MDBIcon } from "mdb-react-ui-kit";
import "./Navbar.css";

export const Navbar = () => {
   const suggestionsArray = [
      "Avatar",
      "Oppenheimer",
      "Dune",
      "Interstellar",
      "Avatar",
      "Oppenheimer",
      "Dune",
      "Interstellar",
   ];
   const [searchTerm, setSearchTerm] = useState("");
   const [suggestions, setSuggestions] = useState([]);

   const handleInputChange = (event) => {
      const value = event.target.value;
      setSearchTerm(value);

      if (value === "") {
         setSuggestions([]);
      } else {
         const filteredSuggestions = suggestionsArray.filter((item) =>
            item.toLowerCase().includes(value.toLowerCase())
         );

         setSuggestions(filteredSuggestions.slice(0, 4));
      }
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
                     <li key={index}>{suggestion}</li>
                  ))}
               </ul>
            )}
         </div>
         <div className="navbar-right-section">
            <div>
               <input id="checkbox_toggle" type="checkbox" className="check" />
               <div className="checkbox">
                  <label className="slide" htmlFor="checkbox_toggle">
                     <label className="toggle" htmlFor="checkbox_toggle"></label>
                     <label className="text" htmlFor="checkbox_toggle">
                        Movie
                     </label>
                     <label className="text" htmlFor="checkbox_toggle">
                        TV Show
                     </label>
                  </label>
               </div>
            </div>
            <div>
               <button className="sign-up-btn">
                  Sign up
                  <div className="arrow-wrapper">
                     <div className="arrow"></div>
                  </div>
               </button>
            </div>
         </div>
      </div>
   );
};
