import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { searchMovies, searchTVShows, searchAnime } from '../services/api';
import { Movie } from '../types/movie';
import { TVShow } from '../types/show';
import { Anime } from '../types/anime';
import Navbar from '../components/Navbar';
import MovieGrid from '../components/MovieGrid';
import ShowGrid from '../components/ShowGrid';
import AnimeGrid from '../components/AnimeGrid';
import LoadingSpinner from '../components/LoadingSpinner';

type ResultType = 'all' | 'movies' | 'shows' | 'anime';

interface SearchResult {
  movies: Movie[];
  shows: TVShow[];
  anime: Anime[];
}

export default function SearchResults() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [results, setResults] = useState<SearchResult>({
    movies: [],
    shows: [],
    anime: [],
  });
  const [activeTab, setActiveTab] = useState<ResultType>('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      if (!query) return;

      setIsLoading(true);
      try {
        const [movieResults, showResults, animeResults] = await Promise.all([
          searchMovies(query),
          searchTVShows(query),
          searchAnime(query),
        ]);

        setResults({
          movies: movieResults,
          shows: showResults,
          anime: animeResults,
        });
      } catch (error) {
        console.error('Error fetching search results:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchResults();
  }, [query]);

  const totalResults =
    results.movies.length + results.shows.length + results.anime.length;

  const TabButton = ({
    type,
    label,
    count,
  }: {
    type: ResultType;
    label: string;
    count: number;
  }) => (
    <button
      onClick={() => setActiveTab(type)}
      className={`px-4 py-2 rounded-lg transition-colors ${
        activeTab === type
          ? 'bg-red-600 text-white'
          : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
      }`}
    >
      {label} ({count})
    </button>
  );

  return (
    <div className="min-h-screen bg-black">
      <Navbar />

      {/* Hero Section */}
      <div className="relative h-[40vh] mb-8">
        <img
          src="https://images.unsplash.com/photo-1485846234645-a62644f84728"
          alt="Search Results"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent">
          <div className="max-w-7xl mx-auto px-4 h-full flex items-end pb-20">
            <div className="max-w-2xl">
              <h1 className="text-4xl font-bold mb-4">
                Search Results for "{query}"
              </h1>
              <p className="text-xl text-gray-300">
                Found {totalResults} results
              </p>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 pb-20">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <LoadingSpinner size="lg" />
          </div>
        ) : (
          <>
            {/* Filter Tabs */}
            <div className="flex flex-wrap gap-4 mb-8">
              <TabButton type="all" label="All Results" count={totalResults} />
              <TabButton
                type="movies"
                label="Movies"
                count={results.movies.length}
              />
              <TabButton
                type="shows"
                label="TV Shows"
                count={results.shows.length}
              />
              <TabButton
                type="anime"
                label="Anime"
                count={results.anime.length}
              />
            </div>

            <div className="space-y-12">
              {activeTab === 'all' && (
                <>
                  {results.movies.length > 0 && (
                    <section>
                      <h2 className="text-2xl font-semibold mb-6">Movies</h2>
                      <MovieGrid title="" movies={results.movies} />
                    </section>
                  )}

                  {results.shows.length > 0 && (
                    <section>
                      <h2 className="text-2xl font-semibold mb-6">TV Shows</h2>
                      <ShowGrid shows={results.shows} />
                    </section>
                  )}

                  {results.anime.length > 0 && (
                    <section>
                      <h2 className="text-2xl font-semibold mb-6">Anime</h2>
                      <AnimeGrid anime={results.anime} />
                    </section>
                  )}
                </>
              )}

              {activeTab === 'movies' && results.movies.length > 0 && (
                <MovieGrid title="Movies" movies={results.movies} />
              )}

              {activeTab === 'shows' && results.shows.length > 0 && (
                <ShowGrid shows={results.shows} />
              )}

              {activeTab === 'anime' && results.anime.length > 0 && (
                <AnimeGrid anime={results.anime} />
              )}

              {!isLoading && totalResults === 0 && (
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
          </>
        )}
      </main>
    </div>
  );
}
