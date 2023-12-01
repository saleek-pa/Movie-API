import React, { createContext, useState } from "react";
import { Route, Routes } from "react-router-dom";
import { Sidebar } from "./Components/Sidebar/Sidebar";
import Discover from "./Pages/Discover/Discover";
import MovieDetails from "./Pages/Details/MovieDetails";
import SeriesDetails from "./Pages/Details/SeriesDetails";
import ViewMoreMovie from "./Pages/ViewMore/MovieViewMore";
import ViewMoreSeries from "./Pages/ViewMore/SeriesViewMore";
import { MainContent } from "./Components/MainContent.js/MainContent";
import "./App.css";

export const MovieContext = createContext();

function App() {
   const [isMovie, setIsMovie] = useState(true);

   function getFormattedDate() {
      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, "0");
      const day = String(today.getDate()).padStart(2, "0");

      const oneMonthAgo = new Date();
      oneMonthAgo.setMonth(today.getMonth() - 1);

      const oneMonthAgoYear = oneMonthAgo.getFullYear();
      const oneMonthAgoMonth = String(oneMonthAgo.getMonth() + 1).padStart(2, "0");
      const oneMonthAgoDay = String(oneMonthAgo.getDate()).padStart(2, "0");

      return [`${year}-${month}-${day}`, `${oneMonthAgoYear}-${oneMonthAgoMonth}-${oneMonthAgoDay}`];
   }

   const dates = getFormattedDate();
   return (
      <>
         <MovieContext.Provider value={{ isMovie, setIsMovie, dates }}>
            <Sidebar />
            <Routes>
               <Route path="/" exact element={<MainContent />} />
               <Route path="/movie" exact element={<MainContent />} />
               <Route path="/movie/:id" element={<MovieDetails />} />
               <Route path="/discover" element={<Discover />} />
               <Route path="/discover/:title" element={<ViewMoreMovie />} />
               <Route path="/tv" exact element={<MainContent />} />
               <Route path="/tv/:id" element={<SeriesDetails />} />
               <Route path="/tv/discover/:title" element={<ViewMoreSeries />} />
            </Routes>
         </MovieContext.Provider>
      </>
   );
}

export default App;
