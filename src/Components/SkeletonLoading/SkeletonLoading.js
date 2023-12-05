import "./SkeletonLoading.css";

const SkeletonLoading = () => {
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

export default SkeletonLoading;
