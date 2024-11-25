export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string;
  watchLater: WatchLaterItem[];
  searchHistory: SearchHistoryItem[];
}

export interface WatchLaterItem {
  id: string;
  imdbID: string;
  title: string;
  poster: string;
  addedAt: number;
}

export interface SearchHistoryItem {
  query: string;
  timestamp: number;
}