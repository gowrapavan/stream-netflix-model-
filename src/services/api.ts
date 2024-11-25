import axios from 'axios';
import { Movie, SearchResponse, MovieDetails } from '../types/movie';
import { TVShow, TVShowDetails, Season } from '../types/show';
import { Anime, AnimeDetails, AnimeEpisode } from '../types/anime';

const API_KEY = 'd547b285';
const BASE_URL = 'https://www.omdbapi.com';
const ANIME_API = 'https://api.jikan.moe/v4';

// Movie API functions
export const searchMovies = async (query: string): Promise<Movie[]> => {
  try {
    const response = await axios.get<SearchResponse>(`${BASE_URL}/?apikey=${API_KEY}&s=${query}&type=movie`);
    return response.data.Search || [];
  } catch (error) {
    console.error('Error searching movies:', error);
    return [];
  }
};

export const getMovieDetails = async (id: string): Promise<MovieDetails | null> => {
  try {
    const response = await axios.get(`${BASE_URL}/?apikey=${API_KEY}&i=${id}&plot=full`);
    return response.data;
  } catch (error) {
    console.error('Error fetching movie details:', error);
    return null;
  }
};

// TV Show API functions
export const searchTVShows = async (query: string): Promise<TVShow[]> => {
  try {
    const response = await axios.get<SearchResponse>(`${BASE_URL}/?apikey=${API_KEY}&s=${query}&type=series`);
    return response.data.Search || [];
  } catch (error) {
    console.error('Error searching TV shows:', error);
    return [];
  }
};

export const getTVShowDetails = async (id: string): Promise<TVShowDetails | null> => {
  try {
    const response = await axios.get(`${BASE_URL}/?apikey=${API_KEY}&i=${id}&plot=full`);
    return response.data;
  } catch (error) {
    console.error('Error fetching TV show details:', error);
    return null;
  }
};

export const getSeasonDetails = async (id: string, seasonNumber: number): Promise<Season | null> => {
  try {
    const response = await axios.get(`${BASE_URL}/?apikey=${API_KEY}&i=${id}&Season=${seasonNumber}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching season details:', error);
    return null;
  }
};





// Anime API functions with improved pagination and error handling
export const searchAnime = async (query: string): Promise<Anime[]> => {
  try {
    const response = await axios.get(`${ANIME_API}/anime`, {
      params: {
        q: query,
        limit: 20, // Adjust the limit as needed
        sfw: true, // Safe for work filter
      }
    });
    return response.data.data.map(formatAnimeResponse);
  } catch (error) {
    console.error('Error searching anime:', error);
    return [];
  }
};

export const getAnimeEpisodes = async (id: string, page = 1): Promise<{ 
  episodes: AnimeEpisode[]; 
  hasNextPage: boolean;
  totalEpisodes: number;
}> => {
  try {
    // First, get the total number of episodes
    const animeResponse = await axios.get(`${ANIME_API}/anime/${id}/full`);
    const totalEpisodes = animeResponse.data.data.episodes || 0;

    // Then get the episodes for the requested page
    const response = await axios.get(`${ANIME_API}/anime/${id}/episodes`, {
      params: {
        page,
        limit: 100 // Get 100 episodes at a time
      }
    });
    
    const episodes = response.data.data.map((episode: any) => ({
      id: episode.mal_id,
      number: episode.mal_id,
      title: episode.title || `Episode ${episode.mal_id}`,
      aired: episode.aired || 'Unknown',
      duration: episode.duration || 'Unknown',
      synopsis: episode.synopsis || ''
    }));

    return {
      episodes,
      hasNextPage: response.data.pagination.has_next_page,
      totalEpisodes
    };
  } catch (error) {
    console.error('Error fetching anime episodes:', error);
    return { episodes: [], hasNextPage: false, totalEpisodes: 0 };
  }
};

export const getTopAnime = async (): Promise<Anime[]> => {
  try {
    const response = await axios.get(`${ANIME_API}/top/anime`, {
      params: {
        limit: 20,
        filter: 'airing' // You can change the filter to "bypopularity" or others if needed
      }
    });
    return response.data.data.map(formatAnimeResponse);
  } catch (error) {
    console.error('Error fetching top anime:', error);
    return [];
  }
};

export const getAnimeDetails = async (id: string): Promise<AnimeDetails | null> => {
  try {
    const response = await axios.get(`${ANIME_API}/anime/${id}/full`);
    const data = response.data.data;
    return {
      id: data.mal_id.toString(),
      title: data.title,
      episodes: data.episodes || 0,
      rating: data.score,
      poster: data.images.jpg.large_image_url,
      synopsis: data.synopsis,
      year: data.year,
      status: data.status,
      genres: data.genres.map((g: any) => g.name),
      trailer: data.trailer?.url || null,
      duration: data.duration,
      source: data.source,
      studios: data.studios.map((s: any) => s.name)
    };
  } catch (error) {
    console.error('Error fetching anime details:', error);
    return null;
  }
};

// Helper function to format anime response consistently
const formatAnimeResponse = (item: any): Anime => ({
  id: item.mal_id.toString(),
  title: item.title,
  episodes: item.episodes || 0,
  rating: item.score,
  poster: item.images.jpg.large_image_url,
  synopsis: item.synopsis,
  year: item.year,
  status: item.status,
  genres: item.genres?.map((g: any) => g.name) || []
});