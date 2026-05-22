import { useCollectionQuery } from '@tanstack-query-firebase/react/firestore';
import { collection, query, where } from 'firebase/firestore';

import { useMemo } from 'react';

import { db } from '../firebase';
import type { Recipe } from '../types';

/** Query key factory for recipes. */
export const recipesQueryKey = (householdId: string) => ['recipes', householdId] as const;

interface UseRecipesResult {
  recipes: Recipe[];
  isLoading: boolean;
  error: Error | null;
}

/**
 * Fetches all recipes for a given household using `useCollectionQuery`
 * from `@tanstack-query-firebase/react`. Results are sorted by
 * `createdAt` descending (newest first).
 */
export const useRecipes = (householdId: string | undefined): UseRecipesResult => {
  const firestoreQuery = useMemo(() => {
    if (!householdId) return null;
    return query(collection(db, 'recipes'), where('householdId', '==', householdId));
  }, [householdId]);

  const { data, isLoading, error } = useCollectionQuery(firestoreQuery!, {
    queryKey: recipesQueryKey(householdId ?? ''),
    enabled: !!firestoreQuery,
  });

  const recipes: Recipe[] = useMemo(() => {
    if (!data) return [];
    const mapped = data.docs.map((d) => ({ id: d.id, ...d.data() }) as Recipe);
    mapped.sort((a, b) => {
      const timeA = a.createdAt?.toMillis?.() || 0;
      const timeB = b.createdAt?.toMillis?.() || 0;
      return timeB - timeA;
    });
    return mapped;
  }, [data]);

  return { recipes, isLoading, error };
};
