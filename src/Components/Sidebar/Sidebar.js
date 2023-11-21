import React, { useState } from "react";
import { MDBIcon } from "mdb-react-ui-kit";
import "./Sidebar.css";
import { useNavigate } from "react-router-dom";

export const Sidebar = () => {
   const navigate = useNavigate();
   const [selectedItem, setSelectedItem] = useState("discover");

   const handleItemClick = (item) => {
      setSelectedItem(item);
      navigate(`/movie/${item}`)
   };

   return (
      <div className="sidebar-container">
         <h1 className="logo">Hello.</h1>
         <div>
            <ul className="sidebar-list">
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
                  className={selectedItem === "my-shows" ? "selected" : ""}
                  onClick={() => handleItemClick("my-shows")}
               >
                  <MDBIcon far icon="calendar-alt" /> My Shows
               </li>
               <li
                  className={selectedItem === "statistics" ? "selected" : ""}
                  onClick={() => handleItemClick("statistics")}
               >
                  <MDBIcon fas icon="chart-pie" /> Statistics
               </li>
               <li
                  className={selectedItem === "settings" ? "selected" : ""}
                  onClick={() => handleItemClick("settings")}
               >
                  <MDBIcon fas icon="cog" /> Settings
               </li>
            </ul>
         </div>
      </div>
   );
};
