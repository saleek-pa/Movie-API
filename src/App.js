import React, { useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { Route, Routes } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Navbar } from './Components/Navbar/Navbar';
import Layout from './Components/Layout/Layout';
import Home from './Pages/Home/Home';
import Discover from './Pages/Discover/Discover';
import Watchlist from './Pages/Watchlist/Watchlist';
import Completed from './Pages/Completed/Completed';
import Recommend from './Pages/Recommend/Recommend';
import MovieDetails from './Pages/Details/MovieDetails';
import SeriesDetails from './Pages/Details/SeriesDetails';
import ViewMoreMovie from './Pages/ViewMore/MovieViewMore';
import ViewMoreSeries from './Pages/ViewMore/SeriesViewMore';
import './App.css';

function App() {
  const user = useSelector((state) => state.user);
  const [showSidebar, setShowSidebar] = useState(true);

  useEffect(() => {
    localStorage.setItem('user', JSON.stringify(user));
    const timeout = setTimeout(() => {
      toast.error('Experiencing loading delays ?\n consider using DNS 1.1.1.1');
    }, 3000);

    return () => clearTimeout(timeout);
    //  eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Toaster />
      <Navbar setShowSidebar={setShowSidebar} />
      <Layout showSidebar={showSidebar}>
        <Routes>
          <Route path="/" element={<Home showSidebar={showSidebar} />} />
          <Route path="/movie" element={<Home showSidebar={showSidebar} />} />
          <Route path="/movie/:id" element={<MovieDetails />} />
          <Route path="/movie/discover/:title" element={<ViewMoreMovie />} />
          <Route path="/tv" element={<Home showSidebar={showSidebar} />} />
          <Route path="/tv/:id" element={<SeriesDetails />} />
          <Route path="/tv/discover/:title" element={<ViewMoreSeries />} />
          <Route path="/discover" element={<Discover />} />
          <Route path="/watchlist" element={<Watchlist />} />
          <Route path="/completed" element={<Completed />} />
          <Route path="/recommend" element={<Recommend />} />
        </Routes>
      </Layout>
    </>
  );
}

export default App;
