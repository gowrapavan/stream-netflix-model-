import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Play, ArrowLeft, Loader } from 'lucide-react';
import { signIn, signUp, clearError } from '../store/slices/authSlice';
import { AppDispatch, RootState } from '../store/store';

interface AuthFormProps {
  mode: 'signin' | 'signup';
}

export default function AuthForm({ mode }: AuthFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error } = useSelector((state: RootState) => state.auth);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (mode === 'signup') {
        await dispatch(signUp({ email, password, displayName })).unwrap();
      } else {
        await dispatch(signIn({ email, password })).unwrap();
      }
      navigate('/');
    } catch (err) {
      // Error is handled by Redux
    }
  };

  const toggleMode = () => {
    dispatch(clearError());
    navigate(mode === 'signin' ? '/signup' : '/login');
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Background Video */}
      <video
        className="absolute inset-0 w-full h-full object-cover"
        autoPlay
        loop
        muted
        playsInline
        poster="https://images.unsplash.com/photo-1626814026160-2237a95fc5a0"
      >
        <source
          src="https://assets.mixkit.co/videos/preview/mixkit-set-of-plateaus-seen-from-the-heights-in-a-sunset-26070-large.mp4"
          type="video/mp4"
        />
      </video>

      {/* Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm" />

      {/* Back Button */}
      <Link
        to="/"
        className="absolute top-8 left-8 text-white hover:text-gray-300 transition duration-300 z-20 flex items-center"
      >
        <ArrowLeft className="w-5 h-5 mr-2" />
        Back to Home
      </Link>

      {/* Auth Form */}
      <div className="relative z-10 w-full max-w-md p-8 bg-black bg-opacity-80 rounded-lg shadow-xl">
        <div className="flex items-center justify-center mb-8">
          <Play className="w-12 h-12 text-red-600" />
          <h1 className="text-3xl font-bold text-white ml-2">Gowra Stream</h1>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-500 bg-opacity-20 border border-red-500 rounded-lg text-red-500 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {mode === 'signup' && (
            <div>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Display Name"
                className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                required
                minLength={2}
              />
            </div>
          )}

          <div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              required
            />
          </div>

          <div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              required
              minLength={6}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition duration-300 flex items-center justify-center"
          >
            {loading ? (
              <Loader className="w-5 h-5 animate-spin" />
            ) : (
              mode === 'signin' ? 'Sign In' : 'Sign Up'
            )}
          </button>

          <div className="flex items-center justify-between text-gray-400">
            {mode === 'signin' && (
              <button
                type="button"
                className="hover:text-white transition duration-300"
                onClick={() => navigate('/forgot-password')}
              >
                Forgot password?
              </button>
            )}
            <button
              type="button"
              className="hover:text-white transition duration-300"
              onClick={toggleMode}
            >
              {mode === 'signin' ? 'Create account' : 'Already have an account?'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}