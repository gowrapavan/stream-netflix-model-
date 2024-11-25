import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

interface AnimePlayerProps {
  title: string;
  episode: number;
  totalEpisodes: number;
  onClose: () => void;
  onPrevious: () => void;
  onNext: () => void;
}

export default function AnimePlayer({ 
  title, 
  episode, 
  totalEpisodes,
  onClose, 
  onPrevious, 
  onNext 
}: AnimePlayerProps) {
  const playerRef = useRef<HTMLDivElement>(null);
  const formattedTitle = title.replace(/\s+/g, '-').toLowerCase();
  const embedUrl = `https://2anime.xyz/embed/${formattedTitle}-episode-${episode}`;

  useEffect(() => {
    if (playerRef.current) {
      playerRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [episode]);

  return (
    <div ref={playerRef} className="relative w-full bg-black rounded-lg overflow-hidden">
      <div className="aspect-video relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-50 p-2 bg-black/50 rounded-full hover:bg-black/70 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
        <iframe
          src={embedUrl}
          className="absolute inset-0 w-full h-full"
          allowFullScreen
          allow="autoplay; fullscreen"
        />
      </div>

      {/* Episode Navigation moved outside the player */}
      <div className="mt-4 flex items-center justify-between px-4 py-3 bg-gray-900 rounded-lg">
        <button
          onClick={onPrevious}
          disabled={episode <= 1}
          className="px-4 py-2 bg-gray-800 rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Previous Episode
        </button>

        <span className="text-gray-400">
          Episode {episode} of {totalEpisodes}
        </span>

        <button
          onClick={onNext}
          disabled={episode >= totalEpisodes}
          className="px-4 py-2 bg-gray-800 rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Next Episode
        </button>
      </div>
    </div>
  );
}