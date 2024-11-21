import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface VideoPlayerProps {
  type?: 'movie' | 'tv';
  imdbId: string;
  season?: number;
  episode?: string;
  onClose: () => void;
}

export default function VideoPlayer({ type = 'movie', imdbId, season, episode, onClose }: VideoPlayerProps) {
  const [showPopup, setShowPopup] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowPopup(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  const embedUrl = type === 'tv'
    ? `https://embed.su/embed/tv/${imdbId}/${season}/${episode}`
    : `https://www.2embed.cc/embed/${imdbId}?autoplay=1&mute=0`;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4 md:p-8">
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors z-[60]"
      >
        <X className="w-6 h-6" />
      </button>
      
      <div className="relative w-full max-w-5xl mx-auto">
        {showPopup && (
          <div className="absolute top-0 left-0 right-0 transform -translate-y-full mb-4 z-[60] animate-fade-in">
            <div className="bg-[#000000cc] backdrop-blur-sm p-4 rounded-lg shadow-xl mx-4">
              <div className="max-w-lg mx-auto">
                <p className="text-white font-medium text-lg mb-2">
                  For a better experience and high-quality playback, use the Vsrc server.
                </p>
                <p className="text-gray-300 text-sm">
                  Enjoy seamless playback in full HD with optimized settings.
                </p>
                <button
                  onClick={() => setShowPopup(false)}
                  className="mt-4 px-4 py-2 bg-[#0073e6] text-white rounded-lg text-sm font-medium hover:bg-[#0066cc] transition-colors"
                >
                  Got it
                </button>
              </div>
            </div>
          </div>
        )}
        
        <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden shadow-2xl">
          <iframe
            src={embedUrl}
            className="absolute inset-0 w-full h-full"
            allowFullScreen
            allow="autoplay; fullscreen"
            style={{ zIndex: 55 }}
          />
        </div>
      </div>
    </div>
  );
}