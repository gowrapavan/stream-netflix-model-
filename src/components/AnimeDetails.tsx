import React from 'react';
import { Star, Calendar, Clock, Film, Tag } from 'lucide-react';
import { AnimeDetails as AnimeDetailsType } from '../types/anime';
import ExpandableText from './ExpandableText';

interface AnimeDetailsProps {
  anime: AnimeDetailsType;
}

export default function AnimeDetails({ anime }: AnimeDetailsProps) {
  return (
    <div className="bg-gray-900 rounded-lg overflow-hidden">
      <div className="relative h-[40vh] md:h-[50vh]">
        <img
          src={anime.poster}
          alt={anime.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">{anime.title}</h1>
          <div className="flex flex-wrap items-center gap-4 text-sm md:text-base">
            <div className="flex items-center">
              <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
              <span>{anime.rating || 'N/A'}</span>
            </div>
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-1" />
              <span>{anime.year || 'N/A'}</span>
            </div>
            <div className="flex items-center">
              <Film className="w-4 h-4 mr-1" />
              <span>{anime.episodes > 0 ? anime.episodes : 1500} Episodes</span>
            </div>
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-1" />
              <span>{anime.duration}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Synopsis</h2>
          <ExpandableText 
            text={anime.synopsis} 
            className="text-gray-300 leading-relaxed"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h2 className="text-xl font-semibold mb-3">Details</h2>
            <dl className="space-y-2">
              <div className="flex items-start">
                <dt className="w-24 text-gray-400">Status</dt>
                <dd>{anime.status}</dd>
              </div>
              <div className="flex items-start">
                <dt className="w-24 text-gray-400">Source</dt>
                <dd>{anime.source}</dd>
              </div>
              <div className="flex items-start">
                <dt className="w-24 text-gray-400">Studios</dt>
                <dd>{anime.studios.join(', ')}</dd>
              </div>
            </dl>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-3">Genres</h2>
            <div className="flex flex-wrap gap-2">
              {anime.genres.map((genre) => (
                <span
                  key={genre}
                  className="inline-flex items-center px-3 py-1 bg-gray-800 rounded-full text-sm"
                >
                  <Tag className="w-3 h-3 mr-1" />
                  {genre}
                </span>
              ))}
            </div>
          </div>
        </div>

        {anime.trailer && (
          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-3">Trailer</h2>
            <div className="aspect-video">
              <iframe
                src={anime.trailer.replace('watch?v=', 'embed/')}
                className="w-full h-full rounded-lg"
                allowFullScreen
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}