import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Play, Star } from 'lucide-react';
import { getTVShowDetails } from '../services/api'; // Import your API function

interface TVShow {
  id: string;
  title: string;
  year: string;
  rating: string;
  poster: string;
}

// IMDb IDs for the shows
const imdbIDs = [
  'tt0903747',
  'tt0944947',
  'tt5180504',
  'tt2442560',
  'tt1190634',
  'tt1520211',
  'tt5753856',
  'tt6468322',
  'tt4574334',
  'tt0108778',
  'tt3032476',
];

export default function FeaturedShows() {
  const [shows, setShows] = useState<TVShow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchShows = async () => {
      try {
        const fetchedShows: TVShow[] = [];
        for (const id of imdbIDs) {
          const data = await getTVShowDetails(id); // Fetch details for each ID
          if (data) {
            fetchedShows.push({
              id: data.imdbID,
              title: data.Title,
              year: data.Year,
              rating: data.imdbRating || 'N/A',
              poster: data.Poster !== 'N/A' ? data.Poster : 'default-poster.jpg',
            });
          }
        }
        setShows(fetchedShows);
      } catch (error) {
        console.error('Error fetching TV shows:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchShows();
  }, []);

  if (loading) {
    return <div>Loading popular TV shows...</div>;
  }

  return (
    <section className="py-12">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold">Popular TV Shows</h2>
        <Link 
          to="/tv-shows" 
          className="text-sm text-gray-400 hover:text-white transition-colors duration-300"
        >
          View All
        </Link>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {shows.map((show) => (
          <Link
            key={show.id}
            to={`/tv-shows/${show.id}`}
            className="group relative flex flex-col bg-gray-900 rounded-lg overflow-hidden transition-transform duration-300 hover:-translate-y-1 hover:shadow-xl"
          >
            <div className="relative aspect-[2/3]">
              <img
                src={show.poster}
                alt={show.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/60 transition-colors duration-300">
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Play className="w-12 h-12 text-white" />
                </div>
              </div>
              <div className="absolute top-2 right-2 flex items-center bg-black/80 rounded-full px-2 py-1 text-sm">
                <Star className="w-3 h-3 text-yellow-400 fill-current mr-1" />
                <span className="text-white">{show.rating}</span>
              </div>
            </div>
            <div className="p-4 flex-grow">
              <h3 className="font-semibold text-lg mb-1 line-clamp-1">{show.title}</h3>
              <p className="text-sm text-gray-400">{show.year}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
