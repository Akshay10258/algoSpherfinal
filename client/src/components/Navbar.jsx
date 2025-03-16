import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiMenu, FiX, FiUser, FiLogOut } from 'react-icons/fi';
import { useUser } from '../contexts/UserContext';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { currentUser, logout } = useUser();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-md dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                Quickcred
              </Link>
            </div>
          </div>
          
          <div className="hidden md:ml-6 md:flex md:items-center md:space-x-4">
            <Link to="/" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-700">
              Home
            </Link>
            <Link to="/chat" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-700">
              Chat
            </Link>
            
            {currentUser ? (
              <div className="flex items-center ml-4">
                <div className="flex items-center bg-indigo-100 dark:bg-indigo-900 rounded-full px-3 py-1 mr-2">
                  <FiUser className="h-4 w-4 text-indigo-600 dark:text-indigo-400 mr-1" />
                  <span className="text-sm font-medium text-indigo-800 dark:text-indigo-300">
                    {currentUser.name}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-red-600 hover:text-red-800 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-900/30"
                >
                  <FiLogOut className="h-4 w-4 mr-1" />
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex space-x-2">
                <Link to="/login" className="px-3 py-2 rounded-md text-sm font-medium text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 dark:text-indigo-400 dark:hover:text-indigo-300 dark:hover:bg-indigo-900/30">
                  Login
                </Link>
                <Link to="/signup" className="px-3 py-2 rounded-md text-sm font-medium bg-indigo-600 text-white hover:bg-indigo-700">
                  Sign Up
                </Link>
              </div>
            )}
          </div>
          
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-md text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white"
            >
              {isOpen ? (
                <FiX className="h-6 w-6" />
              ) : (
                <FiMenu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link to="/" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-700">
              Home
            </Link>
            <Link to="/chat" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-700">
              Chat
            </Link>
            
            {currentUser ? (
              <>
                <div className="flex items-center px-3 py-2">
                  <FiUser className="h-5 w-5 text-indigo-600 dark:text-indigo-400 mr-2" />
                  <span className="text-base font-medium text-indigo-800 dark:text-indigo-300">
                    {currentUser.name}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center px-3 py-2 rounded-md text-base font-medium text-red-600 hover:text-red-800 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-900/30"
                >
                  <FiLogOut className="h-5 w-5 mr-2" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="block px-3 py-2 rounded-md text-base font-medium text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 dark:text-indigo-400 dark:hover:text-indigo-300 dark:hover:bg-indigo-900/30">
                  Login
                </Link>
                <Link to="/signup" className="block px-3 py-2 rounded-md text-base font-medium bg-indigo-600 text-white hover:bg-indigo-700">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
} 