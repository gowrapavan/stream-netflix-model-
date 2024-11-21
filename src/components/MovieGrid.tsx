import React from 'react';
import MovieCard from './MovieCard';
import { Movie } from '../types/movie';

interface MovieGridProps {
  title: string;
  movies: Movie[];
}

export default function MovieGrid({ title, movies }: MovieGridProps) {
  return (
    <section className="py-8">
      <h2 className="text-2xl font-bold mb-6">{title}</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {movies.map((movie) => (
          <MovieCard key={movie.imdbID} movie={movie} />
        ))}
      </div>
    </section>
  );
}