import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Play, Plus, Star } from 'lucide-react';
import { getTVShowDetails, getSeasonDetails } from '../services/api';
import { TVShowDetails as TVShowDetailsType, Season } from '../types/show';
import Navbar from '../components/Navbar';
import VideoPlayer from '../components/VideoPlayer';
import LoadingSpinner from '../components/LoadingSpinner';
import useLoadingState from '../hooks/useLoadingState';

export default function TVShowDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const [show, setShow] = useState<TVShowDetailsType | null>(null);
  const [selectedSeason, setSelectedSeason] = useState<Season | null>(null);
  const [currentSeason, setCurrentSeason] = useState(1);
  const { isLoading, withLoading } = useLoadingState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedEpisode, setSelectedEpisode] = useState<string>('');

  useEffect(() => {
    const fetchShow = async () => {
      if (!id) return;

      await withLoading(async () => {
        const details = await getTVShowDetails(id);
        setShow(details);
        if (details) {
          const seasonDetails = await getSeasonDetails(id, currentSeason);
          setSelectedSeason(seasonDetails);
        }
      });
    };

    fetchShow();
  }, [id, currentSeason, withLoading]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!show) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <p className="text-gray-400">TV show not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      
      {isPlaying && (
        <VideoPlayer
          type="tv"
          imdbId={show.imdbID}
          season={currentSeason}
          episode={selectedEpisode}
          onClose={() => setIsPlaying(false)}
        />
      )}
      
      <div className="relative pt-16">
        {/* Show Poster */}
        <div className="relative h-[70vh]">
          <img
            src={show.Poster !== 'N/A' ? show.Poster : 'https://images.unsplash.com/photo-1485846234645-a62644f84728'}
            alt={show.Title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-4 py-8">
          <Link to="/tv-shows" className="inline-flex items-center text-gray-400 hover:text-white mb-6">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to TV Shows
          </Link>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Show Info */}
            <div className="md:col-span-2">
              <h1 className="text-4xl font-bold mb-4">{show.Title}</h1>
              
              <div className="flex items-center space-x-4 mb-6">
                <span className="text-yellow-400 flex items-center">
                  <Star className="w-4 h-4 mr-1 fill-current" />
                  {show.Rating}
                </span>
                <span>{show.Year}</span>
                <span>{show.Runtime}</span>
                <span>{show.Genre}</span>
              </div>

              <p className="text-gray-300 mb-6">{show.Plot}</p>

              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Cast & Crew</h3>
                <p className="text-gray-300">Director: {show.Director}</p>
                <p className="text-gray-300">Actors: {show.Actors}</p>
              </div>

              {/* Season Selection */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-4">Seasons</h3>
                <div className="flex flex-wrap gap-2">
                  {Array.from({ length: parseInt(show.totalSeasons) }, (_, i) => i + 1).map((season) => (
                    <button
                      key={season}
                      onClick={() => setCurrentSeason(season)}
                      className={`px-4 py-2 rounded-lg ${
                        currentSeason === season
                          ? 'bg-red-600 text-white'
                          : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                      }`}
                    >
                      Season {season}
                    </button>
                  ))}
                </div>
              </div>

              {/* Episodes */}
              {selectedSeason && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold mb-4">Episodes</h3>
                  {selectedSeason.Episodes.map((episode) => (
                    <div
                      key={episode.imdbID}
                      className="bg-gray-800 p-4 rounded-lg hover:bg-gray-700 transition duration-300"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold">
                            {episode.Episode}. {episode.Title}
                          </h4>
                          <p className="text-sm text-gray-400">{episode.Released}</p>
                        </div>
                        <button
                          onClick={() => {
                            setSelectedEpisode(episode.Episode);
                            setIsPlaying(true);
                          }}
                          className="btn-primary flex items-center"
                        >
                          <Play className="w-4 h-4 mr-2" />
                          Play
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Streaming Options */}
            <div className="bg-gray-900 rounded-lg p-6 h-fit">
              <h3 className="text-lg font-semibold mb-4">Streaming Options</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>HD (1080p)</span>
                  <button
                    onClick={() => {
                      setSelectedEpisode('1');
                      setIsPlaying(true);
                    }}
                    className="btn-primary"
                  >
                    Watch Now
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <span>SD (720p)</span>
                  <button
                    onClick={() => {
                      setSelectedEpisode('1');
                      setIsPlaying(true);
                    }}
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