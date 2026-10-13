import { useState, useEffect } from "react";
import {
  signInWithPopup,
  signOut as fbSignOut,
  onAuthStateChanged,
  type User,
} from "firebase/auth";
import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";
import { auth, db, googleProvider } from "./firebase";
import { learner, type LearnerProfile } from "./learner-store";

export type AuthAccount = {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  createdAt?: unknown;
};

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        // Sync cloud profile down to local learner store if exists
        try {
          const userDoc = await getDoc(doc(db, "users", currentUser.uid));
          if (userDoc.exists()) {
            const data = userDoc.data();
            if (data.profile) {
              learner.updateProfile(data.profile);
            }
          }
        } catch (e) {
          console.warn("Firestore sync error (offline or demo):", e);
        }
      }
      setLoading(false);
    });
    return () => unsub();
  }, []);

  return { user, loading };
}

/**
 * Strict Google OAuth Sign-In & Registration
 * Checks Firestore for existing user records to prevent duplicates,
 * or attaches current child profile upon initial creation.
 */
export async function signInWithGoogle(profileToSave?: Partial<LearnerProfile>): Promise<{
  user: User;
  isNewUser: boolean;
}> {
  // Always prompt account selection so users don't accidentally auto-link a wrong account
  googleProvider.setCustomParameters({
    prompt: "select_account",
  });

  const result = await signInWithPopup(auth, googleProvider);
  const user = result.user;

  // Strict check in Firestore for existing account to prevent duplicate account creation
  const userRef = doc(db, "users", user.uid);
  const snap = await getDoc(userRef);

  let isNewUser = false;

  if (!snap.exists()) {
    isNewUser = true;
    // New account: store parent identity + child profile strictly
    await setDoc(userRef, {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      createdAt: serverTimestamp(),
      lastLoginAt: serverTimestamp(),
      profile: profileToSave || {
        name: user.displayName?.split(" ")[0] || "Sprout Adventurer",
        avatarId: "milo",
        grade: "Grade 2",
        hasCompletedTour: false,
      },
    });

    if (profileToSave) {
      learner.updateProfile(profileToSave);
    }
  } else {
    // Existing account: update last login & load existing child profile
    await setDoc(
      userRef,
      {
        lastLoginAt: serverTimestamp(),
      },
      { merge: true }
    );

    const existingData = snap.data();
    if (existingData.profile) {
      learner.updateProfile(existingData.profile);
    }
  }

  return { user, isNewUser };
}

export async function signOutUser() {
  await fbSignOut(auth);
}
