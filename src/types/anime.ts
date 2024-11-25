export interface Anime {
  id: string;
  title: string;
  episodes: number;
  rating: number;
  poster: string;
  synopsis: string;
  year: number;
  status: string;
  genres: string[];
}

export interface AnimeDetails extends Anime {
  trailer: string | null;
  duration: string;
  source: string;
  studios: string[];
}

export interface AnimeEpisode {
  id: number;
  number: number;
  title: string;
  aired: string;
  duration: string;
  synopsis: string;
}