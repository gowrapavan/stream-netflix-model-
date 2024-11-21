import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Play, User, LogOut } from 'lucide-react';
import { signOut } from '../store/slices/authSlice';
import { RootState } from '../store/store';
import SearchBar from './SearchBar';

export default function Navbar() {
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);

  return (
    <nav className="fixed top-0 w-full z-50 bg-gradient-to-b from-black to-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <Play className="w-8 h-8 text-red-600" />
              <span className="ml-2 text-xl font-bold">Gowra Stream</span>
            </Link>
            <div className="hidden md:block ml-10">
              <div className="flex items-center space-x-4">
                <Link to="/" className="nav-link">Home</Link>
                <Link to="/movies" className="nav-link">Movies</Link>
                <Link to="/tv-shows" className="nav-link">TV Shows</Link>
                <Link to="/watchlist" className="nav-link">My List</Link>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <SearchBar />
            {user ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm">{user.email}</span>
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
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}