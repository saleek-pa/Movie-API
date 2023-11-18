import React from "react";
import { Sidebar } from "../../Components/Sidebar/Sidebar";
import { MainContent } from "../../Components/MainContent.js/MainContent";
import "./Home.css"

function Home() {
   return (
      <div className="home-container">
         <Sidebar />
         <MainContent />
      </div>
   );
}

export default Home;
