import React from 'react';
import { TVShow } from '../types/show';
import ShowCard from './ShowCard';

interface ShowGridProps {
  shows: TVShow[];
}

export default function ShowGrid({ shows }: ShowGridProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
      {shows.map((show) => (
        <ShowCard key={show.imdbID} show={show} />
      ))}
    </div>
  );
}