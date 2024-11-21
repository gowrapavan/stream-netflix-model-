import { 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  arrayUnion, 
  arrayRemove,
  collection,
  query,
  where,
  getDocs
} from 'firebase/firestore';
import { updateProfile } from 'firebase/auth';
import { db, auth } from './firebase';
import { UserProfile, WatchLaterItem, SearchHistoryItem } from '../types/user';

export const createUserProfile = async (uid: string, email: string, displayName: string) => {
  const userRef = doc(db, 'users', uid);
  const userProfile: UserProfile = {
    uid,
    email,
    displayName,
    photoURL: `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=random`,
    watchLater: [],
    searchHistory: []
  };
  
  await setDoc(userRef, userProfile);
  return userProfile;
};

export const getUserProfile = async (uid: string) => {
  const userRef = doc(db, 'users', uid);
  const userSnap = await getDoc(userRef);
  
  if (userSnap.exists()) {
    return userSnap.data() as UserProfile;
  }
  return null;
};

export const updateUserDisplayName = async (displayName: string) => {
  const user = auth.currentUser;
  if (!user) throw new Error('No authenticated user');

  await updateProfile(user, { displayName });
  await updateDoc(doc(db, 'users', user.uid), { displayName });
};

export const updateUserPhoto = async (photoURL: string) => {
  const user = auth.currentUser;
  if (!user) throw new Error('No authenticated user');

  await updateProfile(user, { photoURL });
  await updateDoc(doc(db, 'users', user.uid), { photoURL });
};

export const addToWatchLater = async (movie: WatchLaterItem) => {
  const user = auth.currentUser;
  if (!user) throw new Error('No authenticated user');

  const userRef = doc(db, 'users', user.uid);
  await updateDoc(userRef, {
    watchLater: arrayUnion({ ...movie, addedAt: Date.now() })
  });
};

export const removeFromWatchLater = async (movieId: string) => {
  const user = auth.currentUser;
  if (!user) throw new Error('No authenticated user');

  const userRef = doc(db, 'users', user.uid);
  const userSnap = await getDoc(userRef);
  const userData = userSnap.data() as UserProfile;
  
  const movieToRemove = userData.watchLater.find(m => m.imdbID === movieId);
  if (movieToRemove) {
    await updateDoc(userRef, {
      watchLater: arrayRemove(movieToRemove)
    });
  }
};

export const addToSearchHistory = async (query: string) => {
  const user = auth.currentUser;
  if (!user) return;

  const userRef = doc(db, 'users', user.uid);
  const searchItem: SearchHistoryItem = {
    query,
    timestamp: Date.now()
  };

  await updateDoc(userRef, {
    searchHistory: arrayUnion(searchItem)
  });
};