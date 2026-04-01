import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithCredential,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
} from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../config/firebase";

export async function register(
  email: string,
  password: string,
  displayName: string,
  company: string,
  phone?: string
) {
  const { user } = await createUserWithEmailAndPassword(auth, email, password);
  await setDoc(doc(db, "users", user.uid), {
    email,
    displayName,
    company,
    phone: phone ?? "",
    role: "client",
    subscription: "basic",
    createdAt: serverTimestamp(),
  });
  return user;
}

export async function login(email: string, password: string) {
  return signInWithEmailAndPassword(auth, email, password);
}

export async function googleSignIn(accessToken: string) {
  const credential = GoogleAuthProvider.credential(null, accessToken);
  return signInWithCredential(auth, credential);
}

/** Returns true if the user has a completed Firestore profile (company set). */
export async function checkHasProfile(uid: string): Promise<boolean> {
  try {
    const snap = await getDoc(doc(db, "users", uid));
    return snap.exists() && !!snap.data()?.company;
  } catch {
    return false;
  }
}

export async function createProfile(
  uid: string,
  data: {
    email: string;
    displayName: string;
    company: string;
    phone?: string;
  }
) {
  await setDoc(doc(db, "users", uid), {
    ...data,
    phone: data.phone ?? "",
    role: "client",
    subscription: "basic",
    createdAt: serverTimestamp(),
  });
}

export async function logout() {
  return signOut(auth);
}

export async function resetPassword(email: string) {
  return sendPasswordResetEmail(auth, email);
}
