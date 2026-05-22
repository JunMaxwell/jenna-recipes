import { useCollectionQuery } from '@tanstack-query-firebase/react/firestore';
import { collection, query, where } from 'firebase/firestore';

import { useMemo } from 'react';

import { db } from '../firebase';
import type { Household } from '../types';

/** Query key factory for households. */
export const householdsQueryKey = (userId: string) => ['households', userId] as const;

interface UseHouseholdsResult {
  households: Household[];
  isLoading: boolean;
  error: Error | null;
}

/**
 * Fetches all households where the given user is a member using
 * `useCollectionQuery` from `@tanstack-query-firebase/react`.
 */
export const useHouseholds = (userId: string | undefined): UseHouseholdsResult => {
  const firestoreQuery = useMemo(() => {
    if (!userId) return null;
    return query(
      collection(db, 'households'),
      where(`members.${userId}`, 'in', ['admin', 'member', 'viewer']),
    );
  }, [userId]);

  const { data, isLoading, error } = useCollectionQuery(firestoreQuery!, {
    queryKey: householdsQueryKey(userId ?? ''),
    enabled: !!firestoreQuery,
  });

  const households: Household[] = useMemo(() => {
    if (!data) return [];
    return data.docs.map((d) => ({ id: d.id, ...d.data() }) as Household);
  }, [data]);

  return { households, isLoading, error };
};
