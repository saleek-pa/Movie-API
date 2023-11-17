import React from "react";
import { MDBIcon } from "mdb-react-ui-kit";
import "./Sidebar.css";

export const Sidebar = () => {
   return (
      <div className="sidebar-container">
         <h1 className="logo">SideBar</h1>
         <div>
            <ul className="sidebar-list">
               <li>
                  <MDBIcon far icon="compass" /> Discover
               </li>
               <li>
                  <MDBIcon far icon="heart" /> Watchlist
               </li>
               <li>
                  <MDBIcon far icon="calendar-alt" /> My Shows
               </li>
               <li>
                  <MDBIcon fas icon="chart-pie" /> Statistics
               </li>
               <li>
                  <MDBIcon fas icon="cog" /> Settings
               </li>
            </ul>
         </div>
      </div>
   );
};
