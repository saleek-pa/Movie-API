import React, { createContext, useEffect, useState } from "react";
import { Home } from "./Pages/Home/Home";
import { Toaster } from "react-hot-toast";
import { Sidebar } from "./Components/Sidebar/Sidebar";
import { useSelector } from "react-redux";
import { Route, Routes } from "react-router-dom";
import Discover from "./Pages/Discover/Discover";
import Watchlist from "./Pages/Watchlist/Watchlist";
import Completed from "./Pages/Completed/Completed";
import Recommend from "./Pages/Recommend/Recommend";
import MovieDetails from "./Pages/Details/MovieDetails";
import SeriesDetails from "./Pages/Details/SeriesDetails";
import ViewMoreMovie from "./Pages/ViewMore/MovieViewMore";
import ViewMoreSeries from "./Pages/ViewMore/SeriesViewMore";
import "./App.css";

export const MovieContext = createContext();

function App() {
   const [isMovie, setIsMovie] = useState(true);

   const user = useSelector((state) => state.user);

   useEffect(() => {
      localStorage.setItem("user", JSON.stringify(user));
   }, [user]);

   return (
      <>
         <MovieContext.Provider value={{ isMovie, setIsMovie, user }}>
            <Sidebar />
            <Toaster />
            <Routes>
               <Route path="/" element={<Home />} />
               <Route path="/movie" element={<Home />} />
               <Route path="/movie/:id" element={<MovieDetails />} />
               <Route path="/movie/discover/:title" element={<ViewMoreMovie />} />
               <Route path="/tv" element={<Home />} />
               <Route path="/tv/:id" element={<SeriesDetails />} />
               <Route path="/tv/discover/:title" element={<ViewMoreSeries />} />
               <Route path="/discover" element={<Discover />} />
               <Route path="/watchlist" element={<Watchlist />} />
               <Route path="/completed" element={<Completed />} />
               <Route path="/recommend" element={<Recommend />} />
            </Routes>
         </MovieContext.Provider>
      </>
   );
}

export default App;
