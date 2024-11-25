import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Play, Star } from 'lucide-react';
import {
  getTVShowDetails,
  getSeasonDetails,
} from '../services/api';
import { getTVShowRecommendations } from '../services/recommendations';
import {
  TVShowDetails as TVShowDetailsType,
  Season,
  TVShow,
} from '../types/show';
import Navbar from '../components/Navbar';
import VideoPlayer from '../components/VideoPlayer';
import ShowGrid from '../components/ShowGrid';
import LoadingSpinner from '../components/LoadingSpinner';
import BackButton from '../components/BackButton';
import ExpandableText from '../components/ExpandableText';
import useLoadingState from '../hooks/useLoadingState';

export default function TVShowDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const [show, setShow] = useState<TVShowDetailsType | null>(null);
  const [selectedSeason, setSelectedSeason] = useState<Season | null>(null);
  const [currentSeason, setCurrentSeason] = useState(1);
  const [currentEpisode, setCurrentEpisode] = useState(1);
  const [relatedShows, setRelatedShows] = useState<TVShow[]>([]);
  const { isLoading, withLoading } = useLoadingState(true);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const fetchShow = async () => {
      if (!id) return;

      await withLoading(async () => {
        const details = await getTVShowDetails(id);
        setShow(details);
        if (details) {
          const seasonDetails = await getSeasonDetails(id, currentSeason);
          setSelectedSeason(seasonDetails);

          const recommendations = await getTVShowRecommendations(details);
          setRelatedShows(recommendations);
        }
      });
    };

    fetchShow();
  }, [id, currentSeason, withLoading]);

  const handleEpisodeSelect = (episode: number) => {
    setCurrentEpisode(episode);
    setIsPlaying(true);
  };

  const handlePreviousEpisode = () => {
    if (currentEpisode > 1) {
      setCurrentEpisode(currentEpisode - 1);
    }
  };

  const handleNextEpisode = () => {
    if (selectedSeason && currentEpisode < selectedSeason.Episodes.length) {
      setCurrentEpisode(currentEpisode + 1);
    }
  };

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

      <div className="max-w-7xl mx-auto px-4 pt-16">
        <div className="mb-6">
          <BackButton />
        </div>

        {isPlaying && selectedSeason ? (
          <div className="mb-8">
            <VideoPlayer
              type="tv"
              title={show.Title}
              imdbId={show.imdbID}
              season={currentSeason}
              episode={currentEpisode.toString()}
              onPrevious={handlePreviousEpisode}
              onNext={handleNextEpisode}
              currentEpisode={currentEpisode}
              totalEpisodes={selectedSeason.Episodes.length}
            />
          </div>
        ) : (
          <div className="relative h-[70vh] rounded-xl overflow-hidden mb-12">
            <img
              src={
                show.Poster !== 'N/A'
                  ? show.Poster
                  : 'https://images.unsplash.com/photo-1485846234645-a62644f84728'
              }
              alt={show.Title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent">
              <div className="absolute bottom-0 left-0 right-0 p-8">
                <h1 className="text-4xl font-bold mb-4">{show.Title}</h1>
                <div className="flex flex-wrap items-center gap-4 mb-6">
                  <span className="text-yellow-400 flex items-center">
                    <Star className="w-4 h-4 mr-1 fill-current" />
                    {show.Rating}
                  </span>
                  <span>{show.Year}</span>
                  <span>{show.Runtime}</span>
                  <span>{show.Genre}</span>
                </div>
                {selectedSeason?.Episodes[0] && (
                  <button
                    onClick={() => handleEpisodeSelect(1)}
                    className="btn-primary flex items-center"
                  >
                    <Play className="w-5 h-5 mr-2" />
                    Play Episode 1
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Show Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-semibold mb-4">About the Show</h2>
            <ExpandableText text={show.Plot} className="text-gray-300 mb-8" />

            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-4">Cast & Crew</h3>
              <div className="space-y-2">
                <p className="text-gray-300">
                  <span className="text-gray-500">Director:</span>{' '}
                  {show.Director}
                </p>
                <p className="text-gray-300">
                  <span className="text-gray-500">Actors:</span> {show.Actors}
                </p>
              </div>
            </div>

            {/* Season Selection */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-4">Seasons</h3>
              <div className="flex flex-wrap gap-2">
                {Array.from(
                  { length: parseInt(show.totalSeasons) },
                  (_, i) => i + 1
                ).map((season) => (
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
                <h3 className="text-xl font-semibold mb-4">Episodes</h3>
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
                        <p className="text-sm text-gray-400">
                          {episode.Released}
                        </p>
                      </div>
                      <button
                        onClick={() => handleEpisodeSelect(parseInt(episode.Episode))}
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

          <div className="bg-gray-900 rounded-lg p-6 h-fit">
            <h3 className="text-xl font-semibold mb-4">Show Details</h3>
            <div className="space-y-4">
              <div>
                <h4 className="text-gray-500 mb-1">Status</h4>
                <p className="text-gray-300">Running</p>
              </div>
              <div>
                <h4 className="text-gray-500 mb-1">Genre</h4>
                <p className="text-gray-300">{show.Genre}</p>
              </div>
              <div>
                <h4 className="text-gray-500 mb-1">Total Seasons</h4>
                <p className="text-gray-300">{show.totalSeasons}</p>
              </div>
              <div>
                <h4 className="text-gray-500 mb-1">Rating</h4>
                <p className="text-gray-300">{show.Rated}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Related Shows */}
        {relatedShows.length > 0 && (
          <section className="mt-16">
            <h2 className="text-2xl font-bold mb-6">More Like This</h2>
            <ShowGrid shows={relatedShows} />
          </section>
        )}
      </div>
    </div>
  );
}