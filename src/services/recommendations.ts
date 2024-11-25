import { Movie, MovieDetails } from '../types/movie';
import { TVShow, TVShowDetails } from '../types/show';
import { Anime } from '../types/anime';
import { searchMovies, searchTVShows, searchAnime } from './api';

interface RecommendationParams {
  genres?: string[];
  actors?: string[];
  year?: string;
  studios?: string[];
}

export async function getMovieRecommendations(
  movie: MovieDetails
): Promise<Movie[]> {
  const params: RecommendationParams = {
    genres: movie.Genre?.split(', '),
    actors: movie.Actors?.split(', '),
    year: movie.Year,
  };

  // Get recommendations based on primary genre and year range
  const primaryGenre = params.genres?.[0];
  const movieYear = parseInt(params.year || '0');
  const yearRange = 5; // Movies within 5 years

  let recommendations: Movie[] = [];

  if (primaryGenre) {
    const genreResults = await searchMovies(primaryGenre);
    recommendations = genreResults.filter((m) => {
      const year = parseInt(m.Year);
      return (
        m.imdbID !== movie.imdbID && Math.abs(year - movieYear) <= yearRange
      );
    });
  }

  // If we don't have enough recommendations, try actor-based search
  if (recommendations.length < 10 && params.actors?.[0]) {
    const actorResults = await searchMovies(params.actors[0]);
    recommendations = [
      ...recommendations,
      ...actorResults.filter(
        (m) =>
          m.imdbID !== movie.imdbID &&
          !recommendations.some((r) => r.imdbID === m.imdbID)
      ),
    ];
  }

  return recommendations.slice(0, 10);
}

export async function getTVShowRecommendations(
  show: TVShowDetails
): Promise<TVShow[]> {
  const params: RecommendationParams = {
    genres: show.Genre?.split(', '),
    actors: show.Actors?.split(', '),
    year: show.Year,
  };

  const primaryGenre = params.genres?.[0];
  const showYear = parseInt(params.year || '0');
  const yearRange = 5;

  let recommendations: TVShow[] = [];

  if (primaryGenre) {
    const genreResults = await searchTVShows(primaryGenre);
    recommendations = genreResults.filter((s) => {
      const year = parseInt(s.Year);
      return s.imdbID !== show.imdbID && Math.abs(year - showYear) <= yearRange;
    });
  }

  if (recommendations.length < 10 && params.actors?.[0]) {
    const actorResults = await searchTVShows(params.actors[0]);
    recommendations = [
      ...recommendations,
      ...actorResults.filter(
        (s) =>
          s.imdbID !== show.imdbID &&
          !recommendations.some((r) => r.imdbID === s.imdbID)
      ),
    ];
  }

  return recommendations.slice(0, 10);
}

export async function getAnimeRecommendations(anime: Anime): Promise<Anime[]> {
  const params: RecommendationParams = {
    genres: anime.genres,
    year: anime.year?.toString(),
    studios: anime.studios,
  };

  let recommendations: Anime[] = [];

  // Try studio-based recommendations first
  if (params.studios?.[0]) {
    const studioResults = await searchAnime(params.studios[0]);
    recommendations = studioResults.filter((a) => a.id !== anime.id);
  }

  // Add genre-based recommendations
  if (params.genres?.[0]) {
    const genreResults = await searchAnime(params.genres[0]);
    recommendations = [
      ...recommendations,
      ...genreResults.filter(
        (a) => a.id !== anime.id && !recommendations.some((r) => r.id === a.id)
      ),
    ];
  }

  // Sort by similarity score (based on matching genres and year)
  return recommendations
    .map((rec) => ({
      ...rec,
      score: calculateSimilarityScore(anime, rec),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 10);
}

function calculateSimilarityScore(source: Anime, target: Anime): number {
  let score = 0;

  // Genre matching
  const matchingGenres = source.genres.filter((g) => target.genres.includes(g));
  score += matchingGenres.length * 2;

  // Year proximity
  if (source.year && target.year) {
    const yearDiff = Math.abs(source.year - target.year);
    if (yearDiff <= 2) score += 3;
    else if (yearDiff <= 5) score += 2;
    else if (yearDiff <= 10) score += 1;
  }

  // Studio matching
  if (source.studios?.some((s) => target.studios?.includes(s))) {
    score += 3;
  }

  return score;
}
