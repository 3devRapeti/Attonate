import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, GithubAuthProvider } from "firebase/auth";
import { initializeFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Config values come from the .env file at the project root (NOT this file —
// keep real keys out of source). If you need to regenerate them, they're in
// Firebase Console > Project settings > General > Your apps.
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
// Some networks/VPNs/antivirus SSL-inspection setups silently block
// Firestore's default streaming (WebChannel) connection, which shows up as
// requests that just hang instead of erroring. Auto-detecting long-polling
// makes Firestore fall back to plain HTTP requests when that happens.
//
// NOTE: this project's database was created under the database ID "default"
// (not the classic "(default)" the SDK assumes with no third argument) —
// likely because the underlying GCP project already had something occupying
// "(default)". Passing "default" explicitly targets the one that actually
// exists. If the console dropdown shows a different exact ID, update the
// string below to match it exactly.
export const db = initializeFirestore(
  app,
  {
    experimentalAutoDetectLongPolling: true,
  },
  "default"
);
export const storage = getStorage(app);
export const googleProvider = new GoogleAuthProvider();
export const githubProvider = new GithubAuthProvider();
