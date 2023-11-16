import React from "react";
import "../Styles/style.css";

const Header = () => {
   return (
      <header className="header" data-header>
         <div className="container">
            <div className="overlay" data-overlay></div>

            <a href=" " className="logo">
               <h1>Movie API</h1>
            </a>

            <div className="header-actions">
               <div class="search-input-container">
                  <input type="text" name="text" class="search-input" placeholder="search..." />
                  <span class="search-icon">
                     <svg width="19px" height="19px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                        <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
                        <g id="SVGRepo_iconCarrier">
                           {" "}
                           <path
                              opacity="1"
                              d="M14 5H20"
                              stroke="#000"
                              stroke-width="1.5"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                           ></path>{" "}
                           <path
                              opacity="1"
                              d="M14 8H17"
                              stroke="#000"
                              stroke-width="1.5"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                           ></path>{" "}
                           <path
                              d="M21 11.5C21 16.75 16.75 21 11.5 21C6.25 21 2 16.75 2 11.5C2 6.25 6.25 2 11.5 2"
                              stroke="#000"
                              stroke-width="2.5"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                           ></path>{" "}
                           <path
                              opacity="1"
                              d="M22 22L20 20"
                              stroke="#000"
                              stroke-width="3.5"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                           ></path>{" "}
                        </g>
                     </svg>
                  </span>
               </div>

               <button className="btn btn-primary">Sign in</button>
            </div>

            <button className="menu-open-btn" data-menu-open-btn>
               <ion-icon name="reorder-two"></ion-icon>
            </button>

            <nav className="navbar" data-navbar>
               <div className="navbar-top">
                  <a href="./index.html" className="logo">
                     <img src="./assets/images/logo.svg" alt="Filmlane logo" />
                  </a>

                  <button className="menu-close-btn" data-menu-close-btn>
                     <ion-icon name="close-outline"></ion-icon>
                  </button>
               </div>

               <ul className="navbar-list">
                  <li>
                     <a href="./index.html" className="navbar-link">
                        Home
                     </a>
                  </li>

                  <li>
                     <a href=" " className="navbar-link">
                        Movie
                     </a>
                  </li>

                  <li>
                     <a href=" " className="navbar-link">
                        Tv Show
                     </a>
                  </li>

                  <li>
                     <a href=" " className="navbar-link">
                        Genres
                     </a>
                  </li>
               </ul>
            </nav>
         </div>
      </header>
   );
};

export default Header;
