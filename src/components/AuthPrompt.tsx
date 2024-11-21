import React from 'react';
import { Link } from 'react-router-dom';
import { Play } from 'lucide-react';

export default function AuthPrompt() {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center">
          <Play className="w-8 h-8 text-red-600" />
          <div className="ml-4">
            <h3 className="text-lg font-semibold">Unlock Full Access</h3>
            <p className="text-sm text-gray-400">Sign up to enjoy unlimited streaming</p>
          </div>
        </div>
        <Link to="/login" className="btn-primary">
          Sign Up Now
        </Link>
      </div>
    </div>
  );
}