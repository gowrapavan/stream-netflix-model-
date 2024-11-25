export interface Movie {
  imdbID: string;
  Title: string;
  Year: string;
  Type: string;
  Poster: string;
  Plot?: string;
  Genre?: string;
  Director?: string;
  Actors?: string;
  Rating?: string;
  Runtime?: string;
}

export interface SearchResponse {
  Search: Movie[];
  totalResults: string;
  Response: string;
}

export interface MovieDetails extends Movie {
  Plot: string;
  Genre: string;
  Director: string;
  Actors: string;
  Rating: string;
  Runtime: string;
  Response: string;
}