# Gowra Stream - Modern Streaming Platform

A Netflix-inspired streaming platform built with React, TypeScript, and Firebase Authentication.

## Features

### Authentication (Firebase)
- **Sign Up**
  - Email and password registration
  - Password strength validation
  - Error handling for existing accounts
  - Disney+ inspired UI design

- **Sign In**
  - Email and password authentication
  - Persistent sessions
  - Password recovery option
  - Clean error messaging

### Streaming Features
- Browse movies and TV shows
- Search functionality
- Video playback
- User watchlist
- Responsive design

## Technical Stack

### Frontend
- React 18
- TypeScript
- Tailwind CSS
- Redux Toolkit
- Firebase Authentication

### APIs
- Firebase Auth
- OMDb API
- 2embed.cc

## Firebase Setup

1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com)
2. Enable Email/Password authentication:
   - Go to Authentication > Sign-in methods
   - Enable Email/Password provider
3. Get your Firebase configuration:
   - Go to Project Settings > General
   - Scroll to "Your apps" section
   - Click the web icon (</>)
   - Register your app and copy the config object
4. Update `src/services/firebase.ts` with your config:

```typescript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Configure Firebase (see Firebase Setup section)
4. Start the development server: `npm run dev`
5. Open http://localhost:5173 in your browser

## Environment Variables

Create a `.env` file with:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_OMDB_API_KEY=your_api_key
```

## Authentication Flow

1. **Sign Up**
   - User enters email and password
   - Frontend validates input
   - Firebase creates new account
   - User is redirected to home page

2. **Sign In**
   - User enters credentials
   - Firebase authenticates
   - Session is stored
   - User is redirected to home page

3. **Password Recovery**
   - User clicks "Forgot Password"
   - Enters email address
   - Receives reset instructions

4. **Session Management**
   - Firebase handles token refresh
   - Redux stores auth state
   - Protected routes check auth

## Error Handling

- Invalid email format
- Weak password
- Existing email
- Invalid credentials
- Network issues
- Server errors

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

MIT License