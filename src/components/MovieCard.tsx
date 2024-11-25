import React from 'react';
import { Link } from 'react-router-dom';
import { Play } from 'lucide-react';
import { Movie } from '../types/movie';

interface MovieCardProps {
  movie: Movie;
}

export default function MovieCard({ movie }: MovieCardProps) {
  return (
    <Link to={`/movies/${movie.imdbID}`} className="card group">
      <div className="relative aspect-[2/3]">
        <img
          src={movie.Poster !== 'N/A' ? movie.Poster : 'https://images.unsplash.com/photo-1485846234645-a62644f84728'}
          alt={movie.Title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-all duration-300 flex items-center justify-center">
          <Play className="w-12 h-12 text-white opacity-0 group-hover:opacity-100 transition-all duration-300" />
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-semibold truncate">{movie.Title}</h3>
        <p className="text-sm text-gray-400">{movie.Year}</p>
      </div>
    </Link>
  );
}