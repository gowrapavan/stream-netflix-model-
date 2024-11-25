import React from 'react';
import { Link } from 'react-router-dom';
import { Play, Star } from 'lucide-react';
import { Anime } from '../types/anime';

interface AnimeGridProps {
  anime: Anime[];
  showRating?: boolean;
}

export default function AnimeGrid({ anime, showRating = true }: AnimeGridProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
      {anime.map((item) => (
        <Link
          key={`anime-${item.id}`}
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
            {showRating && item.rating && (
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
  );
}