import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Clean base Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyBNZHleMBZkyoHkINDfQkgrXyrdqDJpBgs',
  authDomain: 'homeservices-ai.firebaseapp.com',
  projectId: 'homeservices-ai',
  storageBucket: 'homeservices-ai.firebasestorage.app',
  messagingSenderId: '622300672719',
  appId: '1:622300672719:web:11e377d7a8a42dc8f53dba',
  measurementId: 'G-QKDJHEBN8Z',
};

// Initialize Firebase singleton
export const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;
