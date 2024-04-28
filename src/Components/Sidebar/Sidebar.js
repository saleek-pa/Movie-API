import React, { useState } from 'react';
import { MDBIcon } from 'mdb-react-ui-kit';
import { useDispatch } from 'react-redux';
import { setIsMovie } from '../../Redux/movieSlice';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import './Sidebar.css';

export const Sidebar = ({ showSidebar }) => {
  const [selectedItem, setSelectedItem] = useState('movie');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleItemClick = (item) => {
    setSelectedItem(item);
    navigate(`/${item}`);
  };

  return (
    <div className={`sidebar-container ${showSidebar && 'small-sidebar'}`}>
        <ul className="sidebar-list">
          <li
            className={selectedItem === 'movie' ? 'selected' : ''}
            onClick={() => {
              handleItemClick('movie');
              dispatch(setIsMovie(true));
            }}
          >
            <MDBIcon fas icon="film" /> <p className="list-item">Movie</p>
          </li>
          <li
            className={selectedItem === 'tv' ? 'selected' : ''}
            onClick={() => {
              handleItemClick('tv');
              dispatch(setIsMovie(false));
            }}
          >
            <MDBIcon fas icon="tv" /> <p className="list-item">Series</p>
          </li>
          <li className={selectedItem === 'discover' ? 'selected' : ''} onClick={() => handleItemClick('discover')}>
            <MDBIcon far icon="compass" /> <p className="list-item">Discover</p>
          </li>
          <li className={selectedItem === 'watchlist' ? 'selected' : ''} onClick={() => handleItemClick('watchlist')}>
            <MDBIcon far icon="heart" /> <p className="list-item">Watchlist</p>
          </li>
          <li className={selectedItem === 'completed' ? 'selected' : ''} onClick={() => handleItemClick('completed')}>
            <MDBIcon far icon="calendar-check" /> <p className="list-item">Completed</p>
          </li>
          <li className={selectedItem === 'recommend' ? 'selected' : ''} onClick={() => handleItemClick('recommend')}>
            <MDBIcon far icon="comment-alt" /> <p className="list-item">Recommend</p>
          </li>
          <li
            className={selectedItem === 'statistics' ? 'selected' : ''}
            onClick={() => {
              setSelectedItem('statistics');
              toast("Coming Soon...", {
                duration: 3000,
              });
            }}
          >
            <MDBIcon fas icon="chart-pie" /> <p className="list-item">Statistics</p>
          </li>
        </ul>
    </div>
  );
};
