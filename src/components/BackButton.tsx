import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

interface BackButtonProps {
  className?: string;
}

export default function BackButton({ className = '' }: BackButtonProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const getBackText = () => {
    const path = location.pathname;
    if (path.includes('/movies/')) return 'Back to Movies';
    if (path.includes('/tv-shows/')) return 'Back to TV Shows';
    if (path.includes('/anime/')) return 'Back to Anime';
    if (path.includes('/search')) return 'Back to Search Results';
    return 'Back to Home';
  };

  const getBackPath = () => {
    const path = location.pathname;
    if (path.includes('/movies/')) return '/movies';
    if (path.includes('/tv-shows/')) return '/tv-shows';
    if (path.includes('/anime/')) return '/anime';
    if (location.state?.from) return location.state.from;
    return '/';
  };

  return (
    <button
      onClick={() => navigate(getBackPath())}
      className={`inline-flex items-center text-gray-400 hover:text-white transition-colors ${className}`}
    >
      <ArrowLeft className="w-5 h-5 mr-2" />
      {getBackText()}
    </button>
  );
}