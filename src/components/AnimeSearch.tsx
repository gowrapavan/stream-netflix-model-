import React, { useState } from 'react';
import { Search, Loader } from 'lucide-react';
import { searchAnime } from '../services/api';
import { Anime } from '../types/anime';
import { useNavigate } from 'react-router-dom';

export default function AnimeSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Anime[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsSearching(true);
    setError(null);

    try {
      const data = await searchAnime(query);
      setResults(data);
    } catch (err) {
      setError('Failed to search anime. Please try again.');
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <form onSubmit={handleSearch} className="mb-8">
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search anime..."
            className="w-full px-4 py-3 pl-12 bg-gray-900 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
          />
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          {isSearching && (
            <Loader className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 animate-spin" />
          )}
        </div>
      </form>

      {error && (
        <div className="bg-red-500 bg-opacity-10 border border-red-500 text-red-500 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
        {results.map((anime) => (
          <button
            key={anime.id}
            onClick={() => navigate(`/anime/${anime.id}`)}
            className="group bg-gray-900 rounded-lg overflow-hidden transition-transform hover:-translate-y-1"
          >
            <div className="relative aspect-[3/4]">
              <img
                src={anime.poster}
                alt={anime.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all">
                  <span className="inline-flex items-center px-3 py-1 bg-red-600 text-white rounded-full text-sm">
                    View Details
                  </span>
                </div>
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-lg mb-1 text-left line-clamp-1">
                {anime.title}
              </h3>
              <div className="flex items-center justify-between text-sm text-gray-400">
                <span>{anime.year || 'N/A'}</span>
                <span>{anime.rating || 'N/A'} ★</span>
              </div>
            </div>
          </button>
        ))}
      </div>

      {results.length === 0 && query && !isSearching && (
        <div className="text-center text-gray-400 py-12">
          No results found for "{query}"
        </div>
      )}
    </div>
  );
}