import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setShowProfileMenu(false);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-white/95 backdrop-blur-md shadow-lg sticky top-0 z-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl flex items-center justify-center transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg">
              <span className="text-white text-2xl">🧠</span>
            </div>
            <div>
              <span className="text-2xl font-black bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Mood AI
              </span>
              <p className="text-xs text-gray-500 font-medium">by Aalekh Kumar</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2">
            {isAuthenticated() ? (
              <>
                <Link
                  to="/chat"
                  className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${
                    isActive('/chat')
                      ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg'
                      : 'text-gray-700 hover:bg-purple-50 hover:text-purple-600'
                  }`}
                >
                  💬 Chat
                </Link>
                <Link
                  to="/dashboard"
                  className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${
                    isActive('/dashboard')
                      ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg'
                      : 'text-gray-700 hover:bg-purple-50 hover:text-purple-600'
                  }`}
                >
                  📊 Dashboard
                </Link>
                {isAdmin() && (
                  <Link
                    to="/admin"
                    className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${
                      isActive('/admin')
                        ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg'
                        : 'text-gray-700 hover:bg-purple-50 hover:text-purple-600'
                    }`}
                  >
                    👑 Admin
                  </Link>
                )}

                {/* User Profile Dropdown */}
                <div className="relative ml-4">
                  <button
                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                    className="flex items-center space-x-3 px-4 py-2 rounded-lg hover:bg-gray-100 transition-all duration-300"
                  >
                    <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                      {user?.fullName?.charAt(0).toUpperCase()}
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-bold text-gray-800">{user?.fullName}</p>
                      <p className="text-xs text-gray-500">{user?.email}</p>
                    </div>
                    <svg
                      className={`w-5 h-5 text-gray-500 transition-transform ${
                        showProfileMenu ? 'rotate-180' : ''
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {/* Dropdown Menu */}
                  {showProfileMenu && (
                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-2xl py-2 border border-gray-100 animate-fadeIn">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-sm font-semibold text-gray-800">{user?.fullName}</p>
                        <p className="text-xs text-gray-500">{user?.email}</p>
                        <span className="inline-block mt-2 px-3 py-1 bg-purple-100 text-purple-700 text-xs rounded-full font-semibold">
                          {user?.role}
                        </span>
                      </div>
                      <Link
                        to="/dashboard"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 transition-colors"
                        onClick={() => setShowProfileMenu(false)}
                      >
                        📊 Dashboard
                      </Link>
                      <Link
                        to="/chat"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 transition-colors"
                        onClick={() => setShowProfileMenu(false)}
                      >
                        💬 My Chats
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors font-semibold"
                      >
                        🚪 Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-6 py-2 text-gray-700 hover:text-purple-600 font-semibold transition-colors duration-300"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-bold hover:shadow-lg transform hover:scale-105 transition-all duration-300"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 animate-fadeIn">
            {isAuthenticated() ? (
              <div className="space-y-2">
                <div className="px-4 py-3 bg-gray-50 rounded-lg mb-4">
                  <p className="text-sm font-semibold text-gray-800">{user?.fullName}</p>
                  <p className="text-xs text-gray-500">{user?.email}</p>
                </div>
                <Link
                  to="/chat"
                  className="block px-4 py-3 text-gray-700 hover:bg-purple-50 rounded-lg font-semibold transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  💬 Chat
                </Link>
                <Link
                  to="/dashboard"
                  className="block px-4 py-3 text-gray-700 hover:bg-purple-50 rounded-lg font-semibold transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  📊 Dashboard
                </Link>
                {isAdmin() && (
                  <Link
                    to="/admin"
                    className="block px-4 py-3 text-gray-700 hover:bg-purple-50 rounded-lg font-semibold transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    👑 Admin
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg font-semibold transition-colors"
                >
                  🚪 Logout
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <Link
                  to="/login"
                  className="block px-4 py-3 text-gray-700 hover:bg-purple-50 rounded-lg font-semibold transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="block px-4 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-bold text-center"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;