import React from "react";
import { Navbar } from "../Navbar/Navbar";
import { movies } from "../../DummyData";
import { useMovieCardList } from "../../Hooks/useMovieCardList ";
import "./MainContent.css";

export const MainContent = () => {
   return (
      <div className="main-content-container">
         <Navbar />

         {useMovieCardList(movies, "Trending Now")}
         {useMovieCardList(movies.reverse(), "Returning this Week")}
         {useMovieCardList(movies.reverse(), "New Shows Airing in November")}
         {useMovieCardList(movies.reverse(), "Most Popular")}
      </div>
   );
};
