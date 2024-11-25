import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { searchTVShows } from '../services/api';
import { TVShow } from '../types/show';
import Navbar from '../components/Navbar';
import ShowGrid from '../components/ShowGrid';
import SearchBar from '../components/SearchBar';

export default function TVShows() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [shows, setShows] = useState<TVShow[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchShows = async () => {
      setIsLoading(true);
      const results = await searchTVShows(query || 'popular');
      setShows(results);
      setIsLoading(false);
    };

    fetchShows();
  }, [query]);

  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      
      {/* Hero Section */}
      <div className="relative h-[50vh] mb-8">
        <img
          src="https://media.istockphoto.com/id/1664158578/photo/multiple-television-screens-with-remote-control.jpg?s=612x612&w=0&k=20&c=J6GvwctLD0o30xnqheUXyO1MK61I_8Z6G-IAauut3ms="
          alt="TV Shows"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent">
          <div className="max-w-7xl mx-auto px-4 h-full flex items-end pb-20">
            <div className="max-w-2xl">
              <h1 className="text-5xl font-bold mb-4">TV Shows</h1>
              <p className="text-xl text-gray-300">
                Discover your next favorite series
              </p>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 pb-20">
        <div className="mb-8">
          <SearchBar type="tv" />
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600" />
          </div>
        ) : shows.length > 0 ? (
          <ShowGrid shows={shows} />
        ) : (
          <p className="text-center text-gray-400">No TV shows found</p>
        )}
      </main>
    </div>
  );
}