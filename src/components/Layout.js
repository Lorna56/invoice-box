// frontend/src/components/Layout.js
import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

const Layout = () => {
  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 ml-64 p-8">
        {/* The Outlet component will render the matched child route's element */}
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;