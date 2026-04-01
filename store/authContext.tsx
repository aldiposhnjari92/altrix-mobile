import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { onAuthStateChanged, User as FirebaseUser } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../config/firebase";
import { UserProfile } from "../types";

interface AuthContextType {
  user: UserProfile | null;
  firebaseUser: FirebaseUser | null;
  loading: boolean;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  firebaseUser: null,
  loading: true,
  refreshUser: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);

  async function loadProfile(fbUser: FirebaseUser) {
    try {
      const snap = await getDoc(doc(db, "users", fbUser.uid));
      if (snap.exists()) {
        setUser({ uid: fbUser.uid, ...(snap.data() as Omit<UserProfile, "uid">) });
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    }
  }

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;
    try {
      unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
        if (fbUser) {
          setFirebaseUser(fbUser);
          await loadProfile(fbUser);
        } else {
          setFirebaseUser(null);
          setUser(null);
        }
        setLoading(false);
      });
    } catch {
      setLoading(false);
    }
    return () => unsubscribe?.();
  }, []);

  /** Re-fetches the Firestore profile — call after onboarding saves the doc. */
  const refreshUser = useCallback(async () => {
    if (!firebaseUser) return;
    await loadProfile(firebaseUser);
  }, [firebaseUser]);

  return (
    <AuthContext.Provider value={{ user, firebaseUser, loading, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
