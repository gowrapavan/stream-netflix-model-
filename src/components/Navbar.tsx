import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Play, User, LogOut, Menu, X, Home, Film, Tv, BookmarkCheck, Clapperboard } from 'lucide-react';
import { signOut } from '../store/slices/authSlice';
import { RootState } from '../store/store';
import SearchBar from './SearchBar';

export default function Navbar() {
  const dispatch = useDispatch();
  const location = useLocation();
  const { user } = useSelector((state: RootState) => state.auth);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const navLinks = [
    { to: '/', icon: Home, label: 'Home' },
    { to: '/movies', icon: Film, label: 'Movies' },
    { to: '/tv-shows', icon: Tv, label: 'TV Shows' },
    { to: '/anime', icon: Clapperboard, label: 'Anime' },
    { to: '/watchlist', icon: BookmarkCheck, label: 'My List' },
  ];

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="fixed top-0 w-full z-50 bg-gradient-to-b from-black to-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Mobile menu button */}
          <button
            onClick={toggleSidebar}
            className="md:hidden p-2 rounded-md text-gray-400 hover:text-white"
          >
            <Menu className="w-6 h-6" />
          </button>

          {/* Logo */}
          <Link to="/" className="flex items-center">
            <Play className="w-8 h-8 text-red-600" />
            <span className="ml-2 text-xl font-bold hidden sm:block">Gowra Stream</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="flex items-center space-x-4">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`nav-link ${
                    isActive(link.to)
                      ? 'text-white font-semibold'
                      : 'text-gray-300 hover:text-white'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Search and User */}
          <div className="flex items-center space-x-4">
            <SearchBar />
            {user ? (
              <div className="flex items-center space-x-4">
                <Link
                  to="/profile"
                  className={`text-sm hidden sm:block ${
                    isActive('/profile') ? 'text-white' : 'text-gray-300'
                  }`}
                >
                  {user.email}
                </Link>
                <button
                  onClick={() => dispatch(signOut())}
                  className="text-gray-400 hover:text-white"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <Link to="/login" className="btn-primary flex items-center">
                <User className="w-4 h-4 mr-2" />
                <span className="hidden sm:block">Sign In</span>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity duration-300 md:hidden ${
          isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={toggleSidebar}
      >
        <div
          className={`fixed inset-y-0 left-0 w-64 bg-gray-900 transform transition-transform duration-300 ease-in-out ${
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={toggleSidebar}
            className="absolute top-4 right-4 text-gray-400 hover:text-white"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="mt-8 space-y-6">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`flex items-center space-x-3 py-2 px-4 transition-colors duration-200 ${
                    isActive(link.to)
                      ? 'text-white bg-gray-800'
                      : 'text-gray-300 hover:text-white hover:bg-gray-800'
                  }`}
                  onClick={toggleSidebar}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-lg">{link.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}