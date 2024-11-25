import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { RootState } from '../store/store';
import Navbar from '../components/Navbar';

export default function Profile() {
  const { user, profile } = useSelector((state: RootState) => state.auth);

  if (!user) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 pt-24 pb-12">
        <div className="bg-gray-900 rounded-lg p-8">
          <div className="flex items-center space-x-6 mb-8">
            <img
              src={profile?.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName || '')}`}
              alt={user.displayName || 'Profile'}
              className="w-24 h-24 rounded-full"
            />
            <div>
              <h1 className="text-2xl font-bold">{user.displayName}</h1>
              <p className="text-gray-400">{user.email}</p>
            </div>
          </div>

          <div className="space-y-8">
            <section>
              <h2 className="text-xl font-semibold mb-4">Watch History</h2>
              {/* Watch history implementation */}
              <p className="text-gray-400">Watch history will be displayed here</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">Search History</h2>
              <div className="space-y-2">
                {profile?.searchHistory?.map((item) => (
                  <div key={item.timestamp} className="text-gray-400">
                    {item.query} - {new Date(item.timestamp).toLocaleDateString()}
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}