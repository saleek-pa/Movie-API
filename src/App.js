import { createContext, useState } from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./Pages/Home/Home";
import MovieDetails from "./Pages/Details/MovieDetails";
import SeriesDetails from "./Pages/Details/SeriesDetails";
import ViewMoreMovie from "./Pages/ViewMore/MovieViewMore";

export const MovieContext = createContext();

function App() {
   const [isMovie, setIsMovie] = useState(true);
   return (
      <>
         <MovieContext.Provider value={{ isMovie, setIsMovie }}>
            <Routes>
               <Route path="/" exact element={<Home />} />
               <Route path="/movie" exact element={<Home />} />
               <Route path="/movie/:id" element={<MovieDetails />} />
               <Route path="/movie/discover/:title" element={<ViewMoreMovie />} />
               <Route path="/movie/discover" element={<Home />} />
               <Route path="/movie/my-shows" element={<Home />} />
               <Route path="/tv" exact element={<Home />} />
               <Route path="/tv/:id" element={<SeriesDetails />} />
               <Route path="/tv/discover/:title" element={<ViewMoreMovie />} />
               {/* <Route path="/watchlist" element={<MovieDetails />} />
               <Route path="/my-shows" element={<MovieDetails />} />
               <Route path="/statistics" element={<MovieDetails />} />
               <Route path="/settings" element={<MovieDetails />} /> */}
            </Routes>
         </MovieContext.Provider>
      </>
   );
}

export default App;
