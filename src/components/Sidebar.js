import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Sidebar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  const providerLinks = [
    { path: '/provider-dashboard', label: 'Dashboard', icon: 'dashboard' },
    { path: '/create-invoice', label: 'Create Invoice', icon: 'add' },
  ];

  const purchaserLinks = [
    { path: '/purchaser-dashboard', label: 'Dashboard', icon: 'dashboard' },
  ];

  const links = user?.role === 'provider' ? providerLinks : purchaserLinks;

  const getIcon = (iconName) => {
    switch (iconName) {
      case 'dashboard':
        return (
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
        );
      case 'add':
        return (
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-gray-800 text-white h-screen w-64 fixed left-0 top-0 overflow-y-auto">
      <div className="p-4">
        <h2 className="text-2xl font-bold text-center mb-8">InvoiceBox</h2>
        
        <div className="mb-8 p-4 bg-gray-700 rounded-lg">
          <p className="text-sm text-gray-400">Logged in as</p>
          <p className="font-semibold">{user?.name}</p>
          <p className="text-xs text-gray-400 capitalize">{user?.role}</p>
        </div>
        
        <nav>
          <ul className="space-y-2">
            {links.map((link) => (
              <li key={link.path}>
                <Link
                  to={link.path}
                  className={`flex items-center space-x-3 p-3 rounded-lg transition duration-200 ${
                    isActive(link.path) ? 'bg-blue-600' : 'hover:bg-gray-700'
                  }`}
                >
                  {getIcon(link.icon)}
                  <span>{link.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        
        <div className="mt-8">
          <button
            onClick={logout}
            className="flex items-center space-x-3 p-3 rounded-lg w-full hover:bg-gray-700 transition duration-200"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span>Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;