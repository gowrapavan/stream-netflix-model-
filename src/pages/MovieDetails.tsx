import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Play, Plus, Star } from 'lucide-react';
import { getMovieDetails } from '../services/api';
import { MovieDetails as MovieDetailsType } from '../types/movie';
import Navbar from '../components/Navbar';
import VideoPlayer from '../components/VideoPlayer';

export default function MovieDetails() {
  const { id } = useParams<{ id: string }>();
  const [movie, setMovie] = useState<MovieDetailsType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const fetchMovie = async () => {
      if (id) {
        setIsLoading(true);
        const details = await getMovieDetails(id);
        setMovie(details);
        setIsLoading(false);
      }
    };

    fetchMovie();
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600" />
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <p className="text-gray-400">Movie not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      
      {isPlaying && (
        <VideoPlayer
          imdbId={movie.imdbID}
          onClose={() => setIsPlaying(false)}
        />
      )}
      
      <div className="relative pt-16">
        {/* Movie Poster */}
        <div className="relative h-[70vh]">
          <img
            src={movie.Poster !== 'N/A' ? movie.Poster : 'https://images.unsplash.com/photo-1485846234645-a62644f84728'}
            alt={movie.Title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-4 py-8">
          <Link to="/" className="inline-flex items-center text-gray-400 hover:text-white mb-6">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Home
          </Link>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Movie Info */}
            <div className="md:col-span-2">
              <h1 className="text-4xl font-bold mb-4">{movie.Title}</h1>
              
              <div className="flex items-center space-x-4 mb-6">
                <span className="text-yellow-400 flex items-center">
                  <Star className="w-4 h-4 mr-1 fill-current" />
                  {movie.Rating}
                </span>
                <span>{movie.Year}</span>
                <span>{movie.Runtime}</span>
                <span>{movie.Genre}</span>
              </div>

              <p className="text-gray-300 mb-6">{movie.Plot}</p>

              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Cast & Crew</h3>
                <p className="text-gray-300">Director: {movie.Director}</p>
                <p className="text-gray-300">Actors: {movie.Actors}</p>
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={() => setIsPlaying(true)}
                  className="btn-primary flex items-center"
                >
                  <Play className="w-5 h-5 mr-2" />
                  Play Now
                </button>
                <button className="bg-gray-800 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition duration-300 flex items-center">
                  <Plus className="w-5 h-5 mr-2" />
                  Add to Watchlist
                </button>
              </div>
            </div>

            {/* Streaming Options */}
            <div className="bg-gray-900 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Streaming Options</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>HD (1080p)</span>
                  <button
                    onClick={() => setIsPlaying(true)}
                    className="btn-primary"
                  >
                    Watch Now
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <span>SD (720p)</span>
                  <button
                    onClick={() => setIsPlaying(true)}
                    className="btn-primary"
                  >
                    Watch Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}