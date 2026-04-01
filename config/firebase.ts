import AsyncStorage from "@react-native-async-storage/async-storage";
import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth, initializeAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAieuAbU0Bcsos8wl2XC5OEHtDh7sO4Gqw",
  authDomain: "altrix-6f054.firebaseapp.com",
  databaseURL:
    "https://altrix-6f054-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "altrix-6f054",
  storageBucket: "altrix-6f054.firebasestorage.app",
  messagingSenderId: "832454269094",
  appId: "1:832454269094:web:1c1d55f06dcc32932e3c67",
  measurementId: "G-09WB327VQQ",
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

function createAuth() {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { getReactNativePersistence } = require("firebase/auth");
    if (typeof getReactNativePersistence === "function") {
      return initializeAuth(app, {
        persistence: getReactNativePersistence(AsyncStorage),
      });
    }
  } catch {
    // Already initialized on hot-reload, or getReactNativePersistence unavailable
  }
  return getAuth(app);
}

export const auth = createAuth();
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
