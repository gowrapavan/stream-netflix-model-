export interface TVShow {
  imdbID: string;
  Title: string;
  Year: string;
  Type: string;
  Poster: string;
  totalSeasons?: string;
}

export interface Episode {
  Title: string;
  Released: string;
  Episode: string;
  imdbRating: string;
  imdbID: string;
}

export interface Season {
  Season: string;
  Episodes: Episode[];
}

export interface TVShowDetails extends TVShow {
  Plot: string;
  Genre: string;
  Director: string;
  Actors: string;
  Rating: string;
  Runtime: string;
  totalSeasons: string;
  Response: string;
}