import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MDBIcon } from 'mdb-react-ui-kit';
import axios from '../../Configs/Axios';
import toast from 'react-hot-toast';
import './Navbar.css';

export const Navbar = ({ setShowSidebar }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [mobileSearch, setMobileSearch] = useState(false);
  const navigate = useNavigate();

  const handleSearchInput = async (event) => {
    try {
      const value = event.target.value;
      setSearchTerm(value);

      if (searchTerm !== '') {
        const response = await axios.get(
          `https://api.themoviedb.org/3/search/multi?query=${searchTerm}&include_adult=true`
        );
        setSuggestions(response.data.results.filter((data) => data.media_type !== 'person').slice(0, 5));
      } else setSuggestions([]);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSuggestionClick = (type, id, title) => {
    setSearchTerm('');
    navigate(`/${type}/${id}-${title.toLowerCase().replace(/\s+/g, '-')}`);
  };

  return (
    <nav className="navbar">
      <div className="navbar-left-section">
        <MDBIcon fas icon="bars" className="sidebar-toggle" onClick={() => setShowSidebar((prev) => !prev)} />
        <h1
          className="logo"
          onClick={() => {
            navigate('/');
          }}
        >
          Watchlister
        </h1>
      </div>

      <div className="search-input-container">
        <input
          type="text"
          name="text"
          className={`search-input ${mobileSearch && 'mobile-search-input'}`}
          placeholder="search..."
          value={searchTerm}
          onChange={handleSearchInput}
        />
        {mobileSearch ? (
          <MDBIcon
            fas
            icon="times"
            className="mobile-close-icon"
            onClick={() => {
              setMobileSearch(false);
              setSearchTerm("");
            }}
          />
        ) : (
          <MDBIcon fas icon="search" className="search-icon" />
        )}
        {searchTerm && (
          <ul className="suggestions-list">
            {suggestions.map((data) => (
              <li
                key={data.id}
                onClick={() =>
                  handleSuggestionClick(data.media_type, data.id, data.media_type === 'movie' ? data.title : data.name)
                }
              >
                <img
                  src={
                    data.poster_path
                      ? `https://image.tmdb.org/t/p/w200${data.poster_path}`
                      : 'https://www.proedsolutions.com/wp-content/themes/micron/images/placeholders/placeholder_large_dark.jpg'
                  }
                  alt={data.title || data.name}
                  className="search-movie-image"
                />
                {data.title || data.name} (
                {data.media_type === 'movie' ? data.release_date.split('-')[0] : data.first_air_date.split('-')[0]})
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className={`navbar-right-section ${mobileSearch && 'mobile-navbar-right-section'}`}>
        <MDBIcon
          fas
          icon="search"
          className="mobile-search-icon"
          style={{ cursor: 'pointer' }}
          onClick={() => setMobileSearch(true)}
        />
        <MDBIcon
          fas
          icon="bell"
          style={{ cursor: 'pointer' }}
          onClick={() =>
            toast('Coming Soon...', {
              duration: 3000,
            })
          }
        />
        <MDBIcon
          fas
          icon="user-circle"
          style={{ cursor: 'pointer' }}
          onClick={() =>
            toast('Coming Soon...', {
              duration: 3000,
            })
          }
        />
      </div>
    </nav>
  );
};
