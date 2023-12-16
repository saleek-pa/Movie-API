import { createSlice } from "@reduxjs/toolkit";

const loadState = () => {
   try {
      const serializedState = localStorage.getItem("user");
      return serializedState ? JSON.parse(serializedState) : undefined;
   } catch (error) {
      console.error("Error loading state from localStorage:", error);
      return undefined;
   }
};

const saveState = (state) => {
   try {
      const serializedState = JSON.stringify(state);
      localStorage.setItem("user", serializedState);
   } catch (error) {
      console.error("Error saving state to localStorage:", error);
   }
};

const userSlice = createSlice({
   name: "user",
   initialState: loadState() || {
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
   },
   reducers: {
      setUser: (state, action) => {
         saveState(action.payload);
         return action.payload;
      },
      // const handleWatchlistClick = (contentId, contentType) => {
      //    setUser((prevUser) => {
      //      const updatedWatchlist = {
      //        ...prevUser.watchlist,
      //        [contentType]: [...prevUser.watchlist[contentType], contentId],
      //      };

      //      return {
      //        ...prevUser,
      //        watchlist: updatedWatchlist,
      //      };
      //    });

      //    toast.success("Added to Watchlist");
      //  };
      // For movies
      // handleWatchlistClick(movieId, 'movies');

      // // For series
      // handleWatchlistClick(seriesId, 'series');
   },
});

export const { setUser, getFormattedDate } = userSlice.actions;
export default userSlice.reducer;