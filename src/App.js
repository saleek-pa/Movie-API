import { Route, Routes } from "react-router-dom";
import Home from "./Pages/Home/Home";
import { Details } from "./Pages/Details/Details";
import { createContext, useState } from "react";

export const MovieContext = createContext();

function App() {
   const [isMovie, setIsMovie] = useState(true);
   return (
      <>
         <MovieContext.Provider value={{ isMovie, setIsMovie }}>
            <Routes>
               <Route path="/" exact element={<Home />} />
               <Route path="/movie" exact element={<Home />} />
               <Route path="/tv" exact element={<Home />} />
               <Route path="/movie/discover" element={<Home />} />
               <Route path="/movie/my-shows" element={<Home />} />
               <Route path="/movie/:id" element={<Details />} />
               <Route path="/tv/:id/:title" element={<Details />} />
               <Route path="/watchlist" element={<Details />} />
               <Route path="/my-shows" element={<Details />} />
               <Route path="/statistics" element={<Details />} />
               <Route path="/settings" element={<Details />} />
            </Routes>
         </MovieContext.Provider>
      </>
   );
}

export default App;
