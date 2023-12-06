import { MDBIcon } from "mdb-react-ui-kit";
import "./SkeletonLoading.css";

export const MovieCardListLoading = () => {
   return (
      <div className="movie-card-container">
         <div className="movie-card-list">
            <div className="skeleton-movie-card">
               <div className="skeleton-movie-image" />
               <div className="skeleton-movie-title" />
            </div>
         </div>
      </div>
   );
};

export const MovieDetailsLoading = () => {
   return (
      <div className="movie-details-container">
         <div className="movie-details-image-container">
            <div className="skeleton-movie-details-image" />
            <div className="details-button-container">
               <button className="watch-button">
                  <MDBIcon fas icon="play" className="me-2" />
                  Trailer
               </button>
               <button className="add-list-button">
                  <MDBIcon fas icon="plus" className="me-2" />
                  Watchlist
               </button>
            </div>
         </div>
         <div className="movie-details-right">
            <div className="skeleton-movie-details-title" />
            <div style={{ display: "flex" }}>
               {[...Array(3)].map((_, index) => (
                  <div className="skeleton-movie-details-genre" key={index} />
               ))}
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
               {[...Array(4)].map((_, index) => (
                  <div className="skeleton-movie-details-plot" key={index} />
               ))}
            </div>
            <p className="movie-details-cast">Cast:</p>
            <div className="cast-list-container">
               {[...Array(5)].map((_, index) => (
                  <div className="skeleton-cast-list-card" key={index}>
                     <div className="skeleton-cast-image" />
                  </div>
               ))}
            </div>
         </div>
      </div>
   );
};
