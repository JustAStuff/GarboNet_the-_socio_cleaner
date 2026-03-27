import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "YOUR_FIREBASE_API_KEY",
  authDomain: "garbonet-6f5ee.firebaseapp.com",
  projectId: "garbonet-6f5ee",
  storageBucket: "garbonet-6f5ee.firebasestorage.app",
  messagingSenderId: "360666866257",
  appId: "1:360666866257:web:eebdf92e8a38d986fc4e70",
  measurementId: "G-LJQFDRN71N"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);
