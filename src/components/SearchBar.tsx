import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search as SearchIcon, X, Loader } from 'lucide-react';
import { searchMovies, searchTVShows } from '../services/api';
import { Movie } from '../types/movie';
import { TVShow } from '../types/show';

interface QuickSearchResult {
  movies: Movie[];
  shows: TVShow[];
}

export default function SearchBar() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [quickResults, setQuickResults] = useState<QuickSearchResult>({ movies: [], shows: [] });
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const searchTimeout = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    if (query.trim().length >= 2) {
      setIsLoading(true);
      
      // Clear previous timeout
      if (searchTimeout.current) {
        clearTimeout(searchTimeout.current);
      }

      // Set new timeout for debouncing
      searchTimeout.current = setTimeout(async () => {
        try {
          const [movies, shows] = await Promise.all([
            searchMovies(query),
            searchTVShows(query)
          ]);

          setQuickResults({
            movies: movies.slice(0, 3),
            shows: shows.slice(0, 3)
          });
        } catch (error) {
          console.error('Quick search error:', error);
        } finally {
          setIsLoading(false);
        }
      }, 300);
    } else {
      setQuickResults({ movies: [], shows: [] });
    }

    return () => {
      if (searchTimeout.current) {
        clearTimeout(searchTimeout.current);
      }
    };
  }, [query]);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
      setIsOpen(false);
      setQuery('');
    }
  };

  const closeSearch = () => {
    setIsOpen(false);
    setQuery('');
    setQuickResults({ movies: [], shows: [] });
  };

  const hasQuickResults = quickResults.movies.length > 0 || quickResults.shows.length > 0;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 hover:bg-gray-800 rounded-full transition-colors duration-200"
      >
        <SearchIcon className="w-5 h-5 text-gray-400" />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black bg-opacity-50"
            onClick={closeSearch}
          />
          <div className="absolute right-0 top-12 w-96 bg-gray-900 rounded-lg shadow-lg z-50 overflow-hidden">
            <form onSubmit={handleSubmit} className="relative">
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search movies & TV shows"
                className="w-full px-4 py-3 bg-transparent text-white placeholder-gray-400 focus:outline-none pr-12"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </form>

            {query.trim().length >= 2 && (
              <div className="border-t border-gray-700">
                {isLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader className="w-6 h-6 text-red-600 animate-spin" />
                  </div>
                ) : hasQuickResults ? (
                  <div className="p-2">
                    {quickResults.movies.length > 0 && (
                      <div className="mb-4">
                        <h3 className="text-sm font-semibold text-gray-400 px-2 mb-2">
                          Movies
                        </h3>
                        {quickResults.movies.map((movie) => (
                          <button
                            key={movie.imdbID}
                            onClick={() => navigate(`/movies/${movie.imdbID}`)}
                            className="w-full px-2 py-2 text-left hover:bg-gray-800 rounded-lg"
                          >
                            <p className="font-medium">{movie.Title}</p>
                            <p className="text-sm text-gray-400">{movie.Year}</p>
                          </button>
                        ))}
                      </div>
                    )}

                    {quickResults.shows.length > 0 && (
                      <div>
                        <h3 className="text-sm font-semibold text-gray-400 px-2 mb-2">
                          TV Shows
                        </h3>
                        {quickResults.shows.map((show) => (
                          <button
                            key={show.imdbID}
                            onClick={() => navigate(`/tv-shows/${show.imdbID}`)}
                            className="w-full px-2 py-2 text-left hover:bg-gray-800 rounded-lg"
                          >
                            <p className="font-medium">{show.Title}</p>
                            <p className="text-sm text-gray-400">{show.Year}</p>
                          </button>
                        ))}
                      </div>
                    )}

                    <button
                      onClick={() => handleSubmit()}
                      className="w-full mt-2 px-2 py-2 text-center text-sm text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg"
                    >
                      View all results
                    </button>
                  </div>
                ) : (
                  <div className="p-4 text-center text-gray-400">
                    No results found
                  </div>
                )}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}