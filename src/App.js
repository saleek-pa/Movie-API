import { Route, Routes } from "react-router-dom";
import Home from "./Pages/Home/Home";
import { Details } from "./Pages/Details/Details";

function App() {
   return (
      <>
         <Routes>
            <Route path="/" exact element={<Home />} />
            <Route path="/movie/discover" element={<Home />} />
            <Route path="/movie/my-shows" element={<Home />} />
            <Route path="/movie/:title" element={<Details />} />
            {/* <Route path="/watchlist" element={<Details />} />
            <Route path="/my-shows" element={<Details />} />
            <Route path="/statistics" element={<Details />} />
            <Route path="/settings" element={<Details />} /> */}
         </Routes>
      </>
   );
}

export default App;
