import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MDBIcon } from "mdb-react-ui-kit";
import { MovieContext } from "../../App";
import toast from "react-hot-toast";
import "./Sidebar.css";

export const Sidebar = () => {
   const navigate = useNavigate();
   const { setIsMovie } = useContext(MovieContext);
   const [selectedItem, setSelectedItem] = useState("movie");

   const handleItemClick = (item) => {
      setSelectedItem(item);
      navigate(`/${item}`);
   };

   return (
      <div className="sidebar-container">
         <h1
            className="logo"
            onClick={() => {
               navigate("/");
               setSelectedItem("");
            }}
         >
            Hello.
         </h1>

         <div>
            <ul className="sidebar-list">
               <li
                  className={selectedItem === "movie" ? "selected" : ""}
                  onClick={() => {
                     handleItemClick("movie");
                     setIsMovie(true);
                  }}
               >
                  <MDBIcon fas icon="film" /> Movie
               </li>
               <li
                  className={selectedItem === "tv" ? "selected" : ""}
                  onClick={() => {
                     handleItemClick("tv");
                     setIsMovie(false);
                  }}
               >
                  <MDBIcon fas icon="tv" /> Series
               </li>
               <li
                  className={selectedItem === "discover" ? "selected" : ""}
                  onClick={() => handleItemClick("discover")}
               >
                  <MDBIcon far icon="compass" /> Discover
               </li>
               <li
                  className={selectedItem === "watchlist" ? "selected" : ""}
                  onClick={() => handleItemClick("watchlist")}
               >
                  <MDBIcon far icon="heart" /> Watchlist
               </li>
               <li
                  className={selectedItem === "completed" ? "selected" : ""}
                  onClick={() => handleItemClick("completed")}
               >
                  <MDBIcon far icon="calendar-check" /> Completed
               </li>
               <li
                  className={selectedItem === "statistics" ? "selected" : ""}
                  onClick={() => {
                     setSelectedItem("statistics");
                     toast("It's not yet implemented. Stay tuned!", {
                        duration: 3000,
                     });
                  }}
               >
                  <MDBIcon fas icon="chart-pie" /> Statistics
               </li>
            </ul>
         </div>
      </div>
   );
};
