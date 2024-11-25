import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getAnimeDetails, getAnimeEpisodes, searchAnime } from '../services/api';
import { AnimeDetails as AnimeDetailsType, Anime } from '../types/anime';
import Navbar from '../components/Navbar';
import AnimeDetails from '../components/AnimeDetails';
import AnimePlayer from '../components/AnimePlayer';
import LoadingSpinner from '../components/LoadingSpinner';
import EpisodeList from '../components/EpisodeList';
import BackButton from '../components/BackButton';
import AnimeGrid from '../components/AnimeGrid';

export default function AnimePage() {
  const { id } = useParams<{ id: string }>();
  const [anime, setAnime] = useState<AnimeDetailsType | null>(null);
  const [relatedAnime, setRelatedAnime] = useState<Anime[]>([]);
  const [episodes, setEpisodes] = useState<AnimeEpisode[]>([]);
  const [currentEpisode, setCurrentEpisode] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [totalEpisodes, setTotalEpisodes] = useState(0);
  const [isLoadingEpisodes, setIsLoadingEpisodes] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadAnime = async () => {
      if (!id) return;
      
      setIsLoading(true);
      setError(null);

      try {
        const animeData = await getAnimeDetails(id);
        if (animeData) {
          setAnime(animeData);
          // Set total episodes, defaulting to 1500 if 0
          setTotalEpisodes(animeData.episodes > 0 ? animeData.episodes : 1500);
          await loadEpisodes(1);

          // Load related anime based on genres
          if (animeData.genres.length > 0) {
            const genreQuery = animeData.genres[0];
            const related = await searchAnime(genreQuery);
            setRelatedAnime(related.filter(a => a.id !== id).slice(0, 10));
          }
        } else {
          setError('Anime not found');
        }
      } catch (error) {
        setError('Failed to load anime details. Please try again later.');
        console.error('Error loading anime:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadAnime();
  }, [id]);

  const loadEpisodes = async (page: number) => {
    if (!id) return;

    setIsLoadingEpisodes(true);
    try {
      const { episodes: newEpisodes, hasNextPage: nextPage } = 
        await getAnimeEpisodes(id, page);
      
      if (page === 1) {
        setEpisodes(newEpisodes);
      } else {
        setEpisodes(prev => [...prev, ...newEpisodes]);
      }
      
      setHasNextPage(nextPage);
      setCurrentPage(page);
    } catch (error) {
      console.error('Error loading episodes:', error);
    } finally {
      setIsLoadingEpisodes(false);
    }
  };

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
    if (currentEpisode < totalEpisodes) {
      setCurrentEpisode(currentEpisode + 1);
    }
  };

  const handleLoadMore = async () => {
    if (hasNextPage && !isLoadingEpisodes) {
      await loadEpisodes(currentPage + 1);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error || !anime) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 text-lg mb-4">{error}</p>
          <BackButton />
        </div>
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

        {isPlaying && (
          <div className="mb-8">
            <AnimePlayer
              title={anime.title}
              episode={currentEpisode}
              totalEpisodes={totalEpisodes}
              onClose={() => setIsPlaying(false)}
              onPrevious={handlePreviousEpisode}
              onNext={handleNextEpisode}
            />
          </div>
        )}

        <AnimeDetails anime={anime} />

        <div className="mt-8">
          <EpisodeList
            episodes={episodes}
            currentEpisode={currentEpisode}
            onEpisodeSelect={handleEpisodeSelect}
            hasMore={hasNextPage}
            isLoading={isLoadingEpisodes}
            onLoadMore={handleLoadMore}
            totalEpisodes={totalEpisodes}
          />
        </div>

        {relatedAnime.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6">More Like This</h2>
            <AnimeGrid anime={relatedAnime} />
          </div>
        )}
      </div>
    </div>
  );
}