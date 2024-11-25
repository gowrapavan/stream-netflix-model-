import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Play, Star, TrendingUp } from 'lucide-react';
import { getTopAnime } from '../services/api';
import { Anime } from '../types/anime';
import LoadingSpinner from './LoadingSpinner';

export default function PopularAnime() {
  const [loading, setLoading] = useState(true);
  const [anime, setAnime] = useState<Anime[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnime = async () => {
      setLoading(true);
      setError(null);
      try {
        const results = await getTopAnime();
        setAnime(results.slice(0, 10));
      } catch (error) {
        console.error('Error fetching popular anime:', error);
        setError('Failed to load popular anime');
      } finally {
        setLoading(false);
      }
    };

    fetchAnime();
  }, []);

  if (loading) {
    return (
      <div className="py-12">
        <h2 className="text-2xl font-bold mb-8">Popular Anime</h2>
        <div className="flex justify-center items-center min-h-[300px]">
          <LoadingSpinner size="lg" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-12">
        <h2 className="text-2xl font-bold mb-8">Popular Anime</h2>
        <div className="text-center text-gray-400">
          {error}
        </div>
      </div>
    );
  }

  return (
    <section className="py-12">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center">
          <h2 className="text-2xl font-bold">Popular Anime</h2>
          <TrendingUp className="w-5 h-5 text-red-500 ml-2" />
        </div>
        <Link 
          to="/anime" 
          className="text-sm text-gray-400 hover:text-white transition-colors duration-300"
        >
          View All
        </Link>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {anime.map((item) => (
          <Link
            key={item.id}
            to={`/anime/${item.id}`}
            className="group relative flex flex-col bg-gray-900 rounded-lg overflow-hidden transition-transform duration-300 hover:-translate-y-1 hover:shadow-xl"
          >
            <div className="relative aspect-[2/3]">
              <img
                src={item.poster}
                alt={item.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/60 transition-colors duration-300">
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Play className="w-12 h-12 text-white" />
                </div>
              </div>
              {item.rating && (
                <div className="absolute top-2 right-2 flex items-center bg-black/80 rounded-full px-2 py-1 text-sm">
                  <Star className="w-3 h-3 text-yellow-400 fill-current mr-1" />
                  <span className="text-white">{item.rating}</span>
                </div>
              )}
            </div>
            <div className="p-4 flex-grow">
              <h3 className="font-semibold text-lg mb-1 line-clamp-1">{item.title}</h3>
              <div className="flex items-center justify-between text-sm text-gray-400">
                <span>{item.episodes} Episodes</span>
                <span>{item.year || 'N/A'}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}