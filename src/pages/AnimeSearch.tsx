import React from 'react';
import Navbar from '../components/Navbar';
import AnimeSearch from '../components/AnimeSearch';

export default function AnimeSearchPage() {
  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 pt-24 pb-12">
        <h1 className="text-3xl font-bold mb-8">Search Anime</h1>
        <AnimeSearch />
      </div>
    </div>
  );
}