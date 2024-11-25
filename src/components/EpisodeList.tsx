import React, { useState, useEffect } from 'react';
import { Play, ChevronLeft, ChevronRight } from 'lucide-react';
import { AnimeEpisode } from '../types/anime';

interface EpisodeListProps {
  episodes: AnimeEpisode[];
  currentEpisode: number;
  onEpisodeSelect: (episode: number) => void;
  hasMore: boolean;
  isLoading: boolean;
  onLoadMore: () => void;
  totalEpisodes: number;
}

export default function EpisodeList({
  episodes,
  currentEpisode,
  onEpisodeSelect,
  hasMore,
  isLoading,
  onLoadMore,
  totalEpisodes
}: EpisodeListProps) {
  const EPISODES_PER_SET = 100;
  const EPISODES_PER_PAGE = 10;
  
  const [currentSet, setCurrentSet] = useState(() => 
    Math.floor((currentEpisode - 1) / EPISODES_PER_SET)
  );
  
  const [currentPage, setCurrentPage] = useState(() => 
    Math.floor(((currentEpisode - 1) % EPISODES_PER_SET) / EPISODES_PER_PAGE)
  );

  useEffect(() => {
    const newSet = Math.floor((currentEpisode - 1) / EPISODES_PER_SET);
    const newPage = Math.floor(((currentEpisode - 1) % EPISODES_PER_SET) / EPISODES_PER_PAGE);
    
    if (newSet !== currentSet) {
      setCurrentSet(newSet);
    }
    if (newPage !== currentPage) {
      setCurrentPage(newPage);
    }
  }, [currentEpisode]);

  const totalSets = Math.ceil(totalEpisodes / EPISODES_PER_SET);
  const startEpisode = currentSet * EPISODES_PER_SET + currentPage * EPISODES_PER_PAGE + 1;
  const endEpisode = Math.min(startEpisode + EPISODES_PER_PAGE - 1, totalEpisodes);

  const currentSetEpisodes = episodes.filter(ep => 
    ep.number > currentSet * EPISODES_PER_SET && 
    ep.number <= (currentSet + 1) * EPISODES_PER_SET
  );

  const displayedEpisodes = currentSetEpisodes.slice(
    currentPage * EPISODES_PER_PAGE,
    (currentPage + 1) * EPISODES_PER_PAGE
  );

  const handlePreviousSet = () => {
    if (currentSet > 0) {
      setCurrentSet(currentSet - 1);
      setCurrentPage(0);
      onEpisodeSelect((currentSet - 1) * EPISODES_PER_SET + 1);
      if (hasMore) {
        onLoadMore();
      }
    }
  };

  const handleNextSet = () => {
    if (currentSet < totalSets - 1) {
      setCurrentSet(currentSet + 1);
      setCurrentPage(0);
      onEpisodeSelect(currentSet * EPISODES_PER_SET + EPISODES_PER_SET + 1);
      if (hasMore) {
        onLoadMore();
      }
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
      onEpisodeSelect(currentSet * EPISODES_PER_SET + (currentPage - 1) * EPISODES_PER_PAGE + 1);
    }
  };

  const handleNextPage = () => {
    const maxPage = Math.ceil(currentSetEpisodes.length / EPISODES_PER_PAGE) - 1;
    if (currentPage < maxPage) {
      setCurrentPage(currentPage + 1);
      onEpisodeSelect(currentSet * EPISODES_PER_SET + (currentPage + 1) * EPISODES_PER_PAGE + 1);
    }
  };

  return (
    <div className="bg-gray-900 rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold">Episodes</h2>
        <div className="flex items-center space-x-4">
          <span className="text-gray-400">
            Set {currentSet + 1} of {totalSets}
          </span>
          <div className="flex items-center space-x-2">
            <button
              onClick={handlePreviousSet}
              disabled={currentSet === 0}
              className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="text-gray-400">
              Episodes {currentSet * EPISODES_PER_SET + 1}-{Math.min((currentSet + 1) * EPISODES_PER_SET, totalEpisodes)}
            </span>
            <button
              onClick={handleNextSet}
              disabled={currentSet >= totalSets - 1}
              className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Page Navigation */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={handlePreviousPage}
          disabled={currentPage === 0}
          className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        <span className="text-gray-400">
          Episodes {startEpisode}-{endEpisode}
        </span>
        <button
          onClick={handleNextPage}
          disabled={endEpisode >= Math.min((currentSet + 1) * EPISODES_PER_SET, totalEpisodes)}
          className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>

      {/* Episodes Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {displayedEpisodes.map((episode) => (
          <button
            key={`episode-${episode.number}`}
            onClick={() => onEpisodeSelect(episode.number)}
            className={`w-full text-left p-4 rounded-lg transition-colors ${
              episode.number === currentEpisode
                ? 'bg-red-600'
                : 'bg-gray-800 hover:bg-gray-700'
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold mb-1">
                  Episode {episode.number}
                </div>
                <div className="text-sm text-gray-400 line-clamp-1">
                  {episode.title}
                </div>
              </div>
              <Play className="w-5 h-5 opacity-75" />
            </div>
          </button>
        ))}
      </div>

      {/* Load More Button */}
      {hasMore && currentSet === Math.floor((episodes.length - 1) / EPISODES_PER_SET) && (
        <div className="mt-6 text-center">
          <button
            onClick={onLoadMore}
            disabled={isLoading}
            className="px-6 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Loading...' : 'Load More Episodes'}
          </button>
        </div>
      )}
    </div>
  );
}