import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { RootState } from '../store/store';
import Navbar from '../components/Navbar';
import MovieCard from '../components/MovieCard';
import { removeFromWatchLater } from '../services/userService';

export default function WatchLater() {
  const { user, profile } = useSelector((state: RootState) => state.auth);

  if (!user) {
    return <Navigate to="/login" />;
  }

  const handleRemove = async (movieId: string) => {
    try {
      await removeFromWatchLater(movieId);
    } catch (error) {
      console.error('Error removing movie from watchlist:', error);
    }
  };

  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 pt-24 pb-12">
        <h1 className="text-3xl font-bold mb-8">My Watchlist</h1>
        
        {profile?.watchLater?.length ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {profile.watchLater.map((item) => (
              <div key={item.id} className="relative group">
                <MovieCard
                  movie={{
                    imdbID: item.imdbID,
                    Title: item.title,
                    Poster: item.poster,
                    Type: 'movie',
                    Year: ''
                  }}
                />
                <button
                  onClick={() => handleRemove(item.imdbID)}
                  className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-400 text-center">Your watchlist is empty</p>
        )}
      </div>
    </div>
  );
}