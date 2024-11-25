import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider, useDispatch } from 'react-redux';
import { onAuthStateChanged } from 'firebase/auth';
import { store } from './store/store';
import { auth } from './services/firebase';
import { setUser } from './store/slices/authSlice';
import AuthForm from './components/AuthForm';
import Home from './pages/Home';
import MovieDetails from './pages/MovieDetails';
import TVShows from './pages/TVShows';
import TVShowDetails from './pages/TVShowDetails';
import SearchResults from './pages/SearchResults';
import Profile from './pages/Profile';
import WatchLater from './pages/WatchLater';
import PageTransition from './components/PageTransition';
import AnimePage from './pages/Anime';
import AnimeSearchPage from './pages/AnimeSearch';

function AuthWrapper() {
  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      dispatch(setUser(user));
    });

    return () => unsubscribe();
  }, [dispatch]);

  return (
    <PageTransition>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<AuthForm mode="signin" />} />
        <Route path="/signup" element={<AuthForm mode="signup" />} />
        <Route path="/movies/:id" element={<MovieDetails />} />
        <Route path="/tv-shows" element={<TVShows />} />
        <Route path="/tv-shows/:id" element={<TVShowDetails />} />
        <Route path="/search" element={<SearchResults />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/watchlist" element={<WatchLater />} />
        <Route path="/anime" element={<AnimeSearchPage />} />
        <Route path="/anime/:id" element={<AnimePage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </PageTransition>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <Router>
        <AuthWrapper />
      </Router>
    </Provider>
  );
}