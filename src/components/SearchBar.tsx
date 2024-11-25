import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Search as SearchIcon, X, Play } from 'lucide-react';
import { searchMovies, searchTVShows, searchAnime } from '../services/api';
import { Movie } from '../types/movie';
import { TVShow } from '../types/show';
import { Anime } from '../types/anime';
import LoadingSpinner from './LoadingSpinner';

type SearchResults = {
  movies: Movie[];
  shows: TVShow[];
  anime: Anime[];
};

export default function SearchBar() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResults>({
    movies: [],
    shows: [],
    anime: []
  });
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const searchBarRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (searchBarRef.current && !searchBarRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  useEffect(() => {
    const searchTimeout = setTimeout(async () => {
      if (query.trim()) {
        setIsLoading(true);
        try {
          const [movieResults, showResults, animeResults] = await Promise.all([
            searchMovies(query),
            searchTVShows(query),
            searchAnime(query)
          ]);

          setResults({
            movies: movieResults.slice(0, 5),
            shows: showResults.slice(0, 5),
            anime: animeResults.slice(0, 5)
          });
        } catch (error) {
          console.error('Error searching:', error);
        } finally {
          setIsLoading(false);
        }
      } else {
        setResults({ movies: [], shows: [], anime: [] });
      }
    }, 300);

    return () => clearTimeout(searchTimeout);
  }, [query]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    const totalResults = results.movies.length + results.shows.length + results.anime.length;
    
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1) % totalResults);
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => (prev - 1 + totalResults) % totalResults);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex === -1 || !query.trim()) {
          // If no item is selected or query is empty, navigate to search results
          handleSearch();
        } else {
          // Navigate to selected item
          const flatResults = [
            ...results.movies.map(item => ({ type: 'movies', id: item.imdbID })),
            ...results.shows.map(item => ({ type: 'tv-shows', id: item.imdbID })),
            ...results.anime.map(item => ({ type: 'anime', id: item.id }))
          ];
          const selected = flatResults[selectedIndex];
          if (selected) {
            navigate(`/${selected.type}/${selected.id}`);
            setIsOpen(false);
            setQuery('');
          }
        }
        break;
    }
  };

  const handleSearch = () => {
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
      setIsOpen(false);
      setQuery('');
    }
  };

  const getItemIndex = (type: 'movie' | 'show' | 'anime', index: number) => {
    let baseIndex = 0;
    if (type === 'show') baseIndex = results.movies.length;
    if (type === 'anime') baseIndex = results.movies.length + results.shows.length;
    return baseIndex + index;
  };

  const hasResults = Object.values(results).some(arr => arr.length > 0);

  return (
    <div ref={searchBarRef} className="relative flex-1 sm:flex-none">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 hover:bg-gray-800 rounded-full transition-colors duration-200"
        aria-label="Search"
      >
        <SearchIcon className="w-5 h-5 text-gray-400" />
      </button>

      {isOpen && (
        <div className="fixed inset-x-0 top-0 sm:absolute sm:inset-auto sm:right-0 sm:top-12 p-4 sm:p-0 bg-black/90 sm:bg-transparent backdrop-blur-sm sm:backdrop-blur-none z-50">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSearch();
            }}
            className="relative max-w-lg mx-auto sm:w-[32rem]"
          >
            <div className="bg-gray-900 rounded-lg shadow-lg overflow-hidden">
              <div className="flex items-center p-3 border-b border-gray-800">
                <SearchIcon className="w-5 h-5 text-gray-400 mr-2" />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setSelectedIndex(-1);
                  }}
                  onKeyDown={handleKeyDown}
                  placeholder="Search movies, TV shows, and anime..."
                  className="w-full bg-transparent text-white placeholder-gray-400 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="p-1 hover:text-white text-gray-400 transition-colors"
                  aria-label="Close search"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {query.trim() && (
                <div className="max-h-[60vh] overflow-y-auto">
                  {isLoading ? (
                    <div className="p-4 flex justify-center">
                      <LoadingSpinner size="sm" />
                    </div>
                  ) : hasResults ? (
                    <div className="p-2">
                      {results.movies.length > 0 && (
                        <div className="mb-4">
                          <div className="px-2 py-1 text-sm font-medium text-gray-400">Movies</div>
                          {results.movies.map((movie, index) => (
                            <button
                              key={movie.imdbID}
                              onClick={() => {
                                navigate(`/movies/${movie.imdbID}`);
                                setIsOpen(false);
                                setQuery('');
                              }}
                              className={`w-full p-2 flex items-center space-x-3 rounded-lg transition-colors ${
                                selectedIndex === getItemIndex('movie', index)
                                  ? 'bg-gray-800'
                                  : 'hover:bg-gray-800'
                              }`}
                            >
                              <img
                                src={movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/48x64'}
                                alt={movie.Title}
                                className="w-12 h-16 object-cover rounded"
                              />
                              <div className="flex-1 text-left">
                                <h4 className="font-medium text-white line-clamp-1">{movie.Title}</h4>
                                <p className="text-sm text-gray-400">{movie.Year}</p>
                              </div>
                              <Play className="w-4 h-4 text-gray-400" />
                            </button>
                          ))}
                        </div>
                      )}

                      {results.shows.length > 0 && (
                        <div className="mb-4">
                          <div className="px-2 py-1 text-sm font-medium text-gray-400">TV Shows</div>
                          {results.shows.map((show, index) => (
                            <button
                              key={show.imdbID}
                              onClick={() => {
                                navigate(`/tv-shows/${show.imdbID}`);
                                setIsOpen(false);
                                setQuery('');
                              }}
                              className={`w-full p-2 flex items-center space-x-3 rounded-lg transition-colors ${
                                selectedIndex === getItemIndex('show', index)
                                  ? 'bg-gray-800'
                                  : 'hover:bg-gray-800'
                              }`}
                            >
                              <img
                                src={show.Poster !== 'N/A' ? show.Poster : 'https://via.placeholder.com/48x64'}
                                alt={show.Title}
                                className="w-12 h-16 object-cover rounded"
                              />
                              <div className="flex-1 text-left">
                                <h4 className="font-medium text-white line-clamp-1">{show.Title}</h4>
                                <p className="text-sm text-gray-400">{show.Year}</p>
                              </div>
                              <Play className="w-4 h-4 text-gray-400" />
                            </button>
                          ))}
                        </div>
                      )}

                      {results.anime.length > 0 && (
                        <div className="mb-4">
                          <div className="px-2 py-1 text-sm font-medium text-gray-400">Anime</div>
                          {results.anime.map((anime, index) => (
                            <button
                              key={anime.id}
                              onClick={() => {
                                navigate(`/anime/${anime.id}`);
                                setIsOpen(false);
                                setQuery('');
                              }}
                              className={`w-full p-2 flex items-center space-x-3 rounded-lg transition-colors ${
                                selectedIndex === getItemIndex('anime', index)
                                  ? 'bg-gray-800'
                                  : 'hover:bg-gray-800'
                              }`}
                            >
                              <img
                                src={anime.poster}
                                alt={anime.title}
                                className="w-12 h-16 object-cover rounded"
                              />
                              <div className="flex-1 text-left">
                                <h4 className="font-medium text-white line-clamp-1">{anime.title}</h4>
                                <p className="text-sm text-gray-400">{anime.year || 'N/A'}</p>
                              </div>
                              <Play className="w-4 h-4 text-gray-400" />
                            </button>
                          ))}
                        </div>
                      )}

                      <button
                        onClick={handleSearch}
                        className="w-full mt-2 p-2 text-center text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
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
          </form>
        </div>
      )}
    </div>
  );
}