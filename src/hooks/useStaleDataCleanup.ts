import { User } from 'firebase/auth';
import { collection, deleteDoc, doc, getDocs, query, where } from 'firebase/firestore';

import { useEffect, useRef, useState } from 'react';

import { db } from '../firebase';

interface UseStaleDataCleanupResult {
  isDataDeleted: boolean;
}

/**
 * Runs a one-time cleanup of stale data (older than 24 hours) when the
 * user first authenticates. Uses a ref to ensure it only fires once per
 * session.
 */
export const useStaleDataCleanup = (user: User | null): UseStaleDataCleanupResult => {
  const [isDataDeleted, setIsDataDeleted] = useState(false);
  const hasRun = useRef(false);

  useEffect(() => {
    if (!user || hasRun.current) return;
    hasRun.current = true;

    const cleanup = async () => {
      try {
        const twentyFourHoursAgo = Date.now() - 24 * 60 * 60 * 1000;
        let dataDeleted = false;

        const hQuery = query(
          collection(db, 'households'),
          where(`members.${user.uid}`, 'in', ['admin', 'member', 'viewer']),
        );
        const hSnapshot = await getDocs(hQuery);

        for (const hDoc of hSnapshot.docs) {
          const hData = hDoc.data();
          const createdAt = hData.createdAt?.toMillis?.() || 0;

          if (
            createdAt > 0 &&
            createdAt < twentyFourHoursAgo &&
            hData.ownerId === user.uid &&
            !hData.isStock
          ) {
            try {
              const rQuery = query(collection(db, 'recipes'), where('householdId', '==', hDoc.id));
              const rSnapshot = await getDocs(rQuery);
              for (const rDoc of rSnapshot.docs) {
                try {
                  await deleteDoc(doc(db, 'recipes', rDoc.id));
                } catch (e) {
                  console.error('Failed to delete recipe', e);
                }
              }

              await deleteDoc(doc(db, 'households', hDoc.id));
              dataDeleted = true;
            } catch (e) {
              console.error('Failed to delete household', e);
            }
          } else {
            const rQuery = query(collection(db, 'recipes'), where('householdId', '==', hDoc.id));
            const rSnapshot = await getDocs(rQuery);
            for (const rDoc of rSnapshot.docs) {
              const rData = rDoc.data();
              const rCreatedAt = rData.createdAt?.toMillis?.() || 0;
              if (
                rCreatedAt > 0 &&
                rCreatedAt < twentyFourHoursAgo &&
                !rData.isStock &&
                (rData.authorId === user.uid || hData.ownerId === user.uid)
              ) {
                try {
                  await deleteDoc(doc(db, 'recipes', rDoc.id));
                  dataDeleted = true;
                } catch (e) {
                  console.error('Failed to delete recipe', e);
                }
              }
            }
          }
        }

        if (dataDeleted) {
          setIsDataDeleted(true);
        }
      } catch (error) {
        console.error('Error cleaning up old data:', error);
      }
    };

    void cleanup();
  }, [user]);

  return { isDataDeleted };
};
