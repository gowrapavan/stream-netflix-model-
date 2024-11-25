import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Play, Plus, Star } from 'lucide-react';
import { getMovieDetails } from '../services/api';
import { getMovieRecommendations } from '../services/recommendations';
import { Movie, MovieDetails as MovieDetailsType } from '../types/movie';
import Navbar from '../components/Navbar';
import VideoPlayer from '../components/VideoPlayer';
import MovieGrid from '../components/MovieGrid';
import LoadingSpinner from '../components/LoadingSpinner';
import BackButton from '../components/BackButton';
import ExpandableText from '../components/ExpandableText';

export default function MovieDetails() {
  const { id } = useParams<{ id: string }>();
  const [movie, setMovie] = useState<MovieDetailsType | null>(null);
  const [relatedMovies, setRelatedMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const fetchMovie = async () => {
      if (id) {
        setIsLoading(true);
        try {
          const details = await getMovieDetails(id);
          setMovie(details);

          if (details) {
            const recommendations = await getMovieRecommendations(details);
            setRelatedMovies(recommendations);
          }
        } catch (error) {
          console.error('Error fetching movie:', error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchMovie();
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <LoadingSpinner size="lg" />
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

      <div className="max-w-7xl mx-auto px-4 pt-16">
        <div className="mb-6">
          <BackButton />
        </div>

        {isPlaying ? (
          <div className="mb-8">
            <VideoPlayer
              type="movie"
              title={movie.Title}
              imdbId={movie.imdbID}
            />
          </div>
        ) : (
          <div className="relative h-[70vh] rounded-xl overflow-hidden mb-12">
            <img
              src={
                movie.Poster !== 'N/A'
                  ? movie.Poster
                  : 'https://images.unsplash.com/photo-1485846234645-a62644f84728'
              }
              alt={movie.Title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent">
              <div className="absolute bottom-0 left-0 right-0 p-8">
                <h1 className="text-4xl font-bold mb-4">{movie.Title}</h1>
                <div className="flex flex-wrap items-center gap-4 mb-6">
                  <span className="text-yellow-400 flex items-center">
                    <Star className="w-4 h-4 mr-1 fill-current" />
                    {movie.Rating}
                  </span>
                  <span>{movie.Year}</span>
                  <span>{movie.Runtime}</span>
                  <span>{movie.Genre}</span>
                </div>
                <button
                  onClick={() => setIsPlaying(true)}
                  className="btn-primary flex items-center"
                >
                  <Play className="w-5 h-5 mr-2" />
                  Play Now
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Movie Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-semibold mb-4">About the Movie</h2>
            <ExpandableText text={movie.Plot} className="text-gray-300 mb-8" />

            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-4">Cast & Crew</h3>
              <div className="space-y-2">
                <p className="text-gray-300">
                  <span className="text-gray-500">Director:</span>{' '}
                  {movie.Director}
                </p>
                <p className="text-gray-300">
                  <span className="text-gray-500">Actors:</span> {movie.Actors}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gray-900 rounded-lg p-6 h-fit">
            <h3 className="text-xl font-semibold mb-4">Movie Details</h3>
            <div className="space-y-4">
              <div>
                <h4 className="text-gray-500 mb-1">Release Date</h4>
                <p className="text-gray-300">{movie.Released}</p>
              </div>
              <div>
                <h4 className="text-gray-500 mb-1">Genre</h4>
                <p className="text-gray-300">{movie.Genre}</p>
              </div>
              <div>
                <h4 className="text-gray-500 mb-1">Runtime</h4>
                <p className="text-gray-300">{movie.Runtime}</p>
              </div>
              <div>
                <h4 className="text-gray-500 mb-1">Rating</h4>
                <p className="text-gray-300">{movie.Rated}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Related Movies */}
        {relatedMovies.length > 0 && (
          <section className="mt-16">
            <h2 className="text-2xl font-bold mb-6">More Like This</h2>
            <MovieGrid title="" movies={relatedMovies} />
          </section>
        )}
      </div>
    </div>
  );
}