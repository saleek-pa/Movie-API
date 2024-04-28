import { createSlice } from '@reduxjs/toolkit';

const loadState = () => {
  try {
    const userData = localStorage.getItem('user');
    return userData ? JSON.parse(userData) : undefined;
  } catch (error) {
    console.error('Error loading state from localStorage:', error);
    return undefined;
  }
};

const saveState = (state) => {
  try {
    localStorage.setItem('user', JSON.stringify(state));
  } catch (error) {
    console.error('Error saving state to localStorage:', error);
  }
};

const movieSlice = createSlice({
  name: 'user',
  initialState: {
    isMovie: true,
    ...(loadState() || {
      watchlist: {
        movies: [],
        series: [],
      },
      completed: {
        movies: [],
        series: [],
      },
      season: [],
      episode: [],
    }),
  },
  reducers: {
    setUser: (state, action) => {
      saveState(action.payload);
      return action.payload;
    },

    setIsMovie: (state, action) => {
      state.isMovie = action.payload;
      saveState(state);
    },

    handleWatchlistClick: (state, action) => {
      const { id, type } = action.payload;
      const updatedWatchlist = state.watchlist[type].includes(id)
        ? state.watchlist[type].filter((ids) => ids !== id)
        : [...state.watchlist[type], id];

      state.watchlist = {
        ...state.watchlist,
        [type]: updatedWatchlist,
      };

      saveState(state);
    },

    handleCompletedClick: (state, action) => {
      const { id, type, rating = 1 } = action.payload;
      const updatedCompleted = {
        ...state.completed,
        [type]: [...state.completed[type], { id, rating }],
      };

      const updatedWatchlist = {
        ...state.watchlist,
        [type]: state.watchlist[type].filter((itemId) => itemId !== id),
      };

      state.completed = updatedCompleted;
      state.watchlist = updatedWatchlist;
      saveState(state);
    },

    handleRatingChange: (state, action) => {
      const { id, type, rating } = action.payload;
      const updatedCompleted = {
        ...state.completed,
        [type]: state.completed[type].map((item) => (item.id === id ? { ...item, rating } : item)),
      };

      state.completed = updatedCompleted;
      saveState(state);
    },

    handleSeasonCheckbox: (state, action) => {
      const { seasonId, seasonDetails, seasonChecked, setSeasonChecked, episodeChecked, setEpisodeChecked } =
        action.payload;
      const season = seasonDetails.find((season) => season.id === seasonId);

      if (seasonChecked.includes(seasonId)) {
        setSeasonChecked(seasonChecked.filter((id) => id !== seasonId));
        state.season = state.season.filter((id) => id !== seasonId);
        state.episode = state.episode.filter((epId) => !season.episodes.map((ep) => ep.id).includes(epId));
        setEpisodeChecked(episodeChecked.filter((epId) => !season.episodes.map((ep) => ep.id).includes(epId)));
      } else {
        setSeasonChecked([...seasonChecked, seasonId]);
        state.season = [...state.season, seasonId];
        state.episode = [...state.episode, ...season.episodes.map((ep) => ep.id)];
        setEpisodeChecked([...episodeChecked, ...season.episodes.map((ep) => ep.id)]);
      }
      saveState(state);
    },

    handleEpisodeCheckbox: (state, action) => {
      const { seasonId, episodeId, seasonDetails, episodeChecked, seasonChecked, setSeasonChecked } = action.payload;
      const season = seasonDetails.find((season) => season.id === seasonId);

      if (episodeChecked.includes(episodeId)) {
        episodeChecked.splice(episodeChecked.indexOf(episodeId), 1);
        state.episode = state.episode.filter((id) => id !== episodeId);
      } else {
        episodeChecked.push(episodeId);
        state.episode = [...state.episode, episodeId];
      }

      if (season.episodes.every((ep) => episodeChecked.includes(ep.id))) {
        setSeasonChecked([...seasonChecked, seasonId]);
      } else {
        setSeasonChecked(seasonChecked.filter((id) => id !== seasonId));
      }
      saveState(state);
    },
  },
});

export const {
  setUser,
  setIsMovie,
  handleWatchlistClick,
  handleCompletedClick,
  handleRatingChange,
  handleSeasonCheckbox,
  handleEpisodeCheckbox,
} = movieSlice.actions;
export default movieSlice.reducer;
