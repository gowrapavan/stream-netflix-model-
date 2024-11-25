import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Film } from 'lucide-react';
import { getMovieDetails } from '../services/api';
import { Movie } from '../types/movie';
import Navbar from '../components/Navbar';
import MovieGrid from '../components/MovieGrid';
import LoadingSpinner from '../components/LoadingSpinner';

// Default movie IDs for new releases
const NEW_RELEASES = [
  'tt15398776', // Oppenheimer
  'tt9362722', // Spider-Man: Across the Spider-Verse
  'tt1517268', // Barbie
  'tt15239678', // Mission: Impossible - Dead Reckoning
  'tt8589698', // Dune: Part Two
  'tt14998742', // Guardians of the Galaxy Vol. 3
  'tt10366206', // John Wick: Chapter 4
  'tt5090568', // Ant-Man and the Wasp: Quantumania
  'tt6718170', // The Super Mario Bros. Movie
  'tt10545296', // The Flash
  'tt15789038', // Transformers: Rise of the Beasts
  'tt16419074', // Air
];

export default function Movies() {
  const [newReleases, setNewReleases] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMovies = async () => {
      setIsLoading(true);
      try {
        const movies = await Promise.all(
          NEW_RELEASES.map((id) => getMovieDetails(id))
        );
        setNewReleases(
          movies.filter((movie): movie is Movie => movie !== null)
        );
      } catch (error) {
        console.error('Error fetching movies:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMovies();
  }, []);

  return (
    <div className="min-h-screen bg-black">
      <Navbar />

      {/* Hero Section */}
      <div className="relative h-[50vh] mb-8">
        <img
          src="https://images.unsplash.com/photo-1536440136628-849c177e76a1"
          alt="Movies"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent">
          <div className="max-w-7xl mx-auto px-4 h-full flex items-end pb-20">
            <div className="max-w-2xl">
              <div className="flex items-center gap-3 mb-4">
                <Film className="w-8 h-8 text-red-600" />
                <h1 className="text-5xl font-bold">Movies</h1>
              </div>
              <p className="text-xl text-gray-300">
                Discover the latest blockbusters and must-watch films
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
          <div className="space-y-12">
            {/* New Releases */}
            <section>
              <h2 className="text-2xl font-bold mb-6">New Releases</h2>
              <MovieGrid title="" movies={newReleases} />
            </section>
          </div>
        )}
      </main>
    </div>
  );
}
