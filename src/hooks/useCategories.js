import { useLiveQuery } from 'dexie-react-hooks';
import { useCallback } from 'react';
import db from '../db/db';

export function useCategories(type = null) {
  const categories = useLiveQuery(async () => {
    let results = await db.categories.toArray();
    if (type) {
      results = results.filter(c => c.type === type);
    }
    return results;
  }, [type]);

  const addCategory = useCallback(async (category) => {
    const id = await db.categories.add({
      ...category,
      isDefault: false,
    });
    return id;
  }, []);

  const deleteCategory = useCallback(async (id) => {
    const cat = await db.categories.get(id);
    if (cat?.isDefault) {
      throw new Error('Cannot delete default categories');
    }
    await db.categories.delete(id);
  }, []);

  return {
    categories: categories || [],
    addCategory,
    deleteCategory,
    isLoading: categories === undefined,
  };
}
