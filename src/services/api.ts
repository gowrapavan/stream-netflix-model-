import axios from 'axios';
import { Movie, SearchResponse, MovieDetails } from '../types/movie';
import { TVShow, TVShowDetails, Season } from '../types/show';

const API_KEY = 'd547b285';
const BASE_URL = 'https://www.omdbapi.com';

export const searchMovies = async (query: string): Promise<Movie[]> => {
  try {
    const response = await axios.get<SearchResponse>(`${BASE_URL}/?s=${query}&type=movie&apikey=${API_KEY}`);
    if (response.data.Response === 'True' && Array.isArray(response.data.Search)) {
      return response.data.Search;
    }
    return [];
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error searching movies:', error.message);
    }
    return [];
  }
};

export const searchTVShows = async (query: string): Promise<TVShow[]> => {
  try {
    const response = await axios.get<SearchResponse>(`${BASE_URL}/?s=${query}&type=series&apikey=${API_KEY}`);
    if (response.data.Response === 'True' && Array.isArray(response.data.Search)) {
      return response.data.Search as TVShow[];
    }
    return [];
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error searching TV shows:', error.message);
    }
    return [];
  }
};

export const getMovieDetails = async (imdbId: string): Promise<MovieDetails | null> => {
  try {
    const response = await axios.get<MovieDetails>(`${BASE_URL}/?i=${imdbId}&apikey=${API_KEY}`);
    if (response.data.Response === 'True') {
      return response.data;
    }
    return null;
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error fetching movie details:', error.message);
    }
    return null;
  }
};

export const getTVShowDetails = async (imdbId: string): Promise<TVShowDetails | null> => {
  try {
    const response = await axios.get<TVShowDetails>(`${BASE_URL}/?i=${imdbId}&apikey=${API_KEY}`);
    if (response.data.Response === 'True') {
      return response.data;
    }
    return null;
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error fetching TV show details:', error.message);
    }
    return null;
  }
};

export const getSeasonDetails = async (imdbId: string, season: number): Promise<Season | null> => {
  try {
    const response = await axios.get(`${BASE_URL}/?i=${imdbId}&Season=${season}&apikey=${API_KEY}`);
    if (response.data.Response === 'True') {
      return response.data;
    }
    return null;
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error fetching season details:', error.message);
    }
    return null;
  }
};