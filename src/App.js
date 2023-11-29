import React, { createContext, useState } from "react";
import { Route, Routes } from "react-router-dom";
import { Sidebar } from "./Components/Sidebar/Sidebar";
import MovieDetails from "./Pages/Details/MovieDetails";
import SeriesDetails from "./Pages/Details/SeriesDetails";
import ViewMoreMovie from "./Pages/ViewMore/MovieViewMore";
import ViewMoreSeries from "./Pages/ViewMore/SeriesViewMore";
import { MainContent } from "./Components/MainContent.js/MainContent";
import "./App.css";

export const MovieContext = createContext();

function App() {
   const [isMovie, setIsMovie] = useState(true);
   return (
      <>
         <MovieContext.Provider value={{ isMovie, setIsMovie }}>
            <Sidebar />
            <Routes>
               <Route path="/" exact element={<MainContent />} />
               <Route path="/movie" exact element={<MainContent />} />
               <Route path="/movie/:id" element={<MovieDetails />} />
               <Route path="/movie/discover" element={<MainContent />} />
               <Route path="/movie/discover/:title" element={<ViewMoreMovie />} />
               <Route path="/tv" exact element={<MainContent />} />
               <Route path="/tv/:id" element={<SeriesDetails />} />
               <Route path="/tv/discover/:title" element={<ViewMoreSeries />} />
            </Routes>
         </MovieContext.Provider>
      </>
   );
}

export default App;
