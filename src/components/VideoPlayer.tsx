import React from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';

interface VideoPlayerProps {
  type?: 'movie' | 'tv' | 'anime';
  title: string;
  imdbId: string;
  season?: number;
  episode?: string;
  onClose?: () => void;
  onPrevious?: () => void;
  onNext?: () => void;
  totalEpisodes?: number;
  currentEpisode?: number;
}

export default function VideoPlayer({
  type = 'movie',
  title,
  imdbId,
  season,
  episode,
  onPrevious,
  onNext,
  totalEpisodes,
  currentEpisode,
}: VideoPlayerProps) {
  const embedUrl =
    type === 'tv'
      ? `https://embed.su/embed/tv/${imdbId}/${season}/${episode}`
      : type === 'anime'
      ? `https://2anime.xyz/embed/${title
          .replace(/\s+/g, '-')
          .toLowerCase()}-episode-${episode}`
      : `https://www.2embed.cc/embed/${imdbId}?autoplay=1&mute=0`;

  return (
    <div className="w-full bg-gray-900 rounded-lg overflow-hidden">
      <div className="relative aspect-video">
        <iframe
          src={embedUrl}
          className="absolute inset-0 w-full h-full"
          allowFullScreen
          allow="autoplay; fullscreen"
        />
      </div>

      {(type === 'tv' || type === 'anime') && onPrevious && onNext && (
        <div className="p-4 flex items-center justify-between bg-gray-800">
          <button
            onClick={onPrevious}
            disabled={currentEpisode === 1}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm sm:text-base"
          >
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="hidden sm:inline">Previous Episode</span>
            <span className="sm:hidden">Previous</span>
          </button>

          <div className="text-sm sm:text-base text-gray-300">
            Episode {currentEpisode} of {totalEpisodes}
          </div>

          <button
            onClick={onNext}
            disabled={currentEpisode === totalEpisodes}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm sm:text-base"
          >
            <span className="hidden sm:inline">Next Episode</span>
            <span className="sm:hidden">Next</span>
            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
      )}
    </div>
  );
}
