import { useQueryClient } from '@tanstack/react-query';
import { User, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

import { useEffect, useState } from 'react';

import { auth, db } from '../firebase';

/** Query key for the authenticated user state. */
export const AUTH_USER_QUERY_KEY = ['auth', 'user'] as const;

interface UseAuthUserResult {
  user: User | null;
  isLoading: boolean;
}

/**
 * Subscribes to Firebase `onAuthStateChanged` and pushes the current user
 * into TanStack Query's cache. On first sign-in, ensures a user profile
 * document exists in Firestore.
 */
export const useAuthUser = (): UseAuthUserResult => {
  const queryClient = useQueryClient();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      queryClient.setQueryData(AUTH_USER_QUERY_KEY, firebaseUser);

      if (firebaseUser) {
        // Ensure user profile exists in Firestore
        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
        if (!userDoc.exists()) {
          await setDoc(doc(db, 'users', firebaseUser.uid), {
            displayName: firebaseUser.displayName || 'Anonymous Chef',
            photoURL: firebaseUser.photoURL || '',
          });
        }
      }

      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [queryClient]);

  return { user, isLoading };
};
