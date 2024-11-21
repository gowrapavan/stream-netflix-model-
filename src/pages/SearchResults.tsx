import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { searchMovies, searchTVShows } from '../services/api';
import { Movie } from '../types/movie';
import { TVShow } from '../types/show';
import Navbar from '../components/Navbar';
import MovieGrid from '../components/MovieGrid';
import ShowGrid from '../components/ShowGrid';
import { addToSearchHistory } from '../services/userService';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import LoadingSpinner from '../components/LoadingSpinner';
import useLoadingState from '../hooks/useLoadingState';

export default function SearchResults() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [movies, setMovies] = useState<Movie[]>([]);
  const [shows, setShows] = useState<TVShow[]>([]);
  const { isLoading, withLoading } = useLoadingState(true);
  const { user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    const fetchResults = async () => {
      if (!query) return;
      
      await withLoading(async () => {
        const [movieResults, showResults] = await Promise.all([
          searchMovies(query),
          searchTVShows(query)
        ]);
        
        setMovies(movieResults);
        setShows(showResults);

        // Save search history for logged-in users
        if (user) {
          await addToSearchHistory(query);
        }
      });
    };

    fetchResults();
  }, [query, user, withLoading]);

  const hasResults = movies.length > 0 || shows.length > 0;

  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      
      <div className="pt-24 pb-12 max-w-7xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            Search Results for "{query}"
          </h1>
          {!isLoading && hasResults && (
            <p className="text-gray-400">
              Found {movies.length + shows.length} results
            </p>
          )}
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <LoadingSpinner size="lg" />
          </div>
        ) : hasResults ? (
          <div className="space-y-12">
            {movies.length > 0 && (
              <section>
                <h2 className="text-2xl font-semibold mb-6 flex items-center">
                  Movies
                  <span className="ml-3 text-sm text-gray-400 font-normal">
                    {movies.length} results
                  </span>
                </h2>
                <MovieGrid title="" movies={movies} />
              </section>
            )}

            {shows.length > 0 && (
              <section>
                <h2 className="text-2xl font-semibold mb-6 flex items-center">
                  TV Shows
                  <span className="ml-3 text-sm text-gray-400 font-normal">
                    {shows.length} results
                  </span>
                </h2>
                <ShowGrid shows={shows} />
              </section>
            )}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg mb-4">
              No results found for "{query}"
            </p>
            <p className="text-gray-500">
              Try adjusting your search terms or browse our categories
            </p>
          </div>
        )}
      </div>
    </div>
  );
}