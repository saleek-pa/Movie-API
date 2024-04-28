import React from 'react';
import { Sidebar } from '../../Components/Sidebar/Sidebar';
import './Layout.css';

const Layout = ({ children, showSidebar }) => {
  return (
    <div className="layout-container">
      <Sidebar showSidebar={showSidebar} />
      <div className="content">
        {children}
      </div>
    </div>
  );
};

export default Layout;
