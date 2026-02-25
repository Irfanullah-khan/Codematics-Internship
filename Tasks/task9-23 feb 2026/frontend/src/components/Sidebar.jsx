import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { FiHome, FiBookOpen, FiUsers, FiRefreshCw, FiClock, FiLogOut } from 'react-icons/fi';

const Sidebar = () => {
  const navigate = useNavigate();

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: <FiHome className="w-5 h-5 mr-3" /> },
    { name: 'Books', path: '/books', icon: <FiBookOpen className="w-5 h-5 mr-3" /> },
    { name: 'Members', path: '/members', icon: <FiUsers className="w-5 h-5 mr-3" /> },
    { name: 'Issue & Return', path: '/issues', icon: <FiRefreshCw className="w-5 h-5 mr-3" /> },
    { name: 'History', path: '/history', icon: <FiClock className="w-5 h-5 mr-3" /> },
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    navigate('/login');
  };

  return (
    <div className="w-64 bg-white/80 backdrop-blur-md dark:bg-gray-800/80 border-r border-gray-100 dark:border-gray-700/50 flex flex-col justify-between hidden md:flex shadow-xl shadow-gray-200/20 dark:shadow-none z-20">
      <div>
        <div className="h-20 flex items-center justify-center px-6 border-b border-gray-100 dark:border-gray-700/50">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-indigo-700 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <FiBookOpen className="text-white w-5 h-5" />
            </div>
            <span className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-indigo-800 dark:from-indigo-400 dark:to-indigo-200">
              Libio
            </span>
          </div>
        </div>
        <nav className="mt-8 px-4 space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center px-4 py-3.5 text-sm font-semibold rounded-xl transition-all duration-200 group ${
                  isActive
                    ? 'bg-gradient-to-r from-indigo-500 to-indigo-600 text-white shadow-md shadow-indigo-500/20'
                    : 'text-gray-600 hover:bg-indigo-50/50 dark:text-gray-300 dark:hover:bg-gray-700/50 hover:text-indigo-600 dark:hover:text-white'
                }`
              }
            >
              <div className={`mr-3 transition-transform duration-200 group-hover:scale-110`}>
                {item.icon}
              </div>
              {item.name}
            </NavLink>
          ))}
        </nav>
      </div>
      <div className="p-4 border-t dark:border-gray-700">
        <button
          onClick={handleLogout}
          className="flex items-center w-full px-4 py-2 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
        >
          <FiLogOut className="w-5 h-5 mr-3" />
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
