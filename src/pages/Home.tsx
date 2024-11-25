import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { searchMovies, getMovieDetails } from '../services/api';
import { Movie } from '../types/movie';
import Navbar from '../components/Navbar';
import MovieGrid from '../components/MovieGrid';
import FeaturedShows from '../components/FeaturedShows';
import AuthPrompt from '../components/AuthPrompt';
import PopularAnime from '../components/PopularAnime';

export default function Home() {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const [marvelMovies, setMarvelMovies] = useState<Movie[]>([]);
  const [actionMovies, setActionMovies] = useState<Movie[]>([]);
  const [trendingMovies, setTrendingMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const marvelMovieIds = [
      'tt0848228', // The Avengers
      'tt4154796', // Avengers: Endgame
      'tt2395427', // Inception
      'tt1843866', // The Dark Knight
      'tt3501632', // Justice League
      'tt10872600', // Spider-Man: No Way Home
      'tt1825683', // Captain America: Civil War
      'tt9114286', // The Shawshank Redemption
    ];

    const trendingNowIds = [
      'tt9218128', // The Witcher
      'tt13622970', // Game of Thrones
      'tt6263850', // The Mandalorian
      'tt29623480', // Stranger Things
      'tt16366836', // Peaky Blinders
      'tt10954600', // The Boys
      'tt5834204', // Money Heist
      'tt0451279', // Breaking Bad
      'tt2213054', // The Crown
      'tt0111161', // The Shawshank Redemption
    ];

    const fetchMovies = async () => {
      try {
        setIsLoading(true);

        const marvelMovieDetails = await Promise.all(
          marvelMovieIds.map((id) => getMovieDetails(id))
        );
        setMarvelMovies(marvelMovieDetails.filter((movie) => movie !== null) as Movie[]);

        const trendingMovieDetails = await Promise.all(
          trendingNowIds.map((id) => getMovieDetails(id))
        );
        setTrendingMovies(trendingMovieDetails.filter((movie) => movie !== null) as Movie[]);

        const actionMoviesResponse = await searchMovies('action');
        setActionMovies(actionMoviesResponse.slice(0, 10));

      } catch (error) {
        if (error instanceof Error) {
          console.error('Error fetching movies:', error.message);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchMovies();
  }, []);

  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      
      {/* Hero Section */}
      <div className="relative h-[70vh] mb-8">
        <img
          src="https://images.unsplash.com/photo-1536440136628-849c177e76a1"
          alt="Hero"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent">
          <div className="max-w-7xl mx-auto px-4 h-full flex items-end pb-20">
            <div className="max-w-2xl">
              <h1 className="text-5xl font-bold mb-4">Welcome to Gowra Stream</h1>
              <p className="text-xl text-gray-300 mb-6">
                Discover thousands of movies, TV shows, and anime. Start streaming today.
              </p>
              {!isAuthenticated && (
                <button className="btn-primary text-lg px-8 py-3">
                  Start Your Free Trial
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 pb-20">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
          </div>
        ) : (
          <>
            {/* Display Trending Movies First */}
            <MovieGrid title="Trending Movies" movies={trendingMovies} />

            {/* Add Featured Shows (Series Section) */}
            <FeaturedShows />

            {/* Add Popular Anime Section */}
            <PopularAnime />

            {/* Display Marvel Movies */}
            <MovieGrid title="Marvel Movies" movies={marvelMovies} />

            {/* Display Action Movies */}
            <MovieGrid title="Action Movies" movies={actionMovies} />
          </>
        )}
      </main>

      {!isAuthenticated && <AuthPrompt />}
    </div>
  );
}