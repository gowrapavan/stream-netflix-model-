import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { login } from '../store/slices/authSlice';
import { Play, ArrowLeft } from 'lucide-react';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, validate credentials with backend
    dispatch(login({ email, name: email.split('@')[0] }));
    navigate('/');
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

      {/* Login Form */}
      <div className="relative z-10 w-full max-w-md p-8 bg-black bg-opacity-80 rounded-lg shadow-xl">
        <div className="flex items-center justify-center mb-8">
          <Play className="w-12 h-12 text-red-600" />
          <h1 className="text-3xl font-bold text-white ml-2">Gowra Stream</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
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
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition duration-300"
          >
            Sign In
          </button>

          <div className="flex items-center justify-between text-gray-400">
            <a href="#" className="hover:text-white transition duration-300">
              Forgot password?
            </a>
            <a href="#" className="hover:text-white transition duration-300">
              Sign up now
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}