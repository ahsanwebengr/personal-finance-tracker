import db from './db';

const DEFAULT_CATEGORIES = [
  { name: 'Salary', type: 'income', icon: '💰', isDefault: true },
  { name: 'Freelance', type: 'income', icon: '💻', isDefault: true },
  { name: 'Investment', type: 'income', icon: '📈', isDefault: true },
  { name: 'Other Income', type: 'income', icon: '🎁', isDefault: true },
  { name: 'Food', type: 'expense', icon: '🍔', isDefault: true },
  { name: 'Transport', type: 'expense', icon: '🚗', isDefault: true },
  { name: 'Shopping', type: 'expense', icon: '🛍️', isDefault: true },
  { name: 'Bills', type: 'expense', icon: '📄', isDefault: true },
  { name: 'Entertainment', type: 'expense', icon: '🎮', isDefault: true },
  { name: 'Health', type: 'expense', icon: '💊', isDefault: true },
  { name: 'Education', type: 'expense', icon: '📚', isDefault: true },
  { name: 'Other', type: 'expense', icon: '📦', isDefault: true },
];

let isSeeding = false;

export async function seedCategories() {
  if (isSeeding) return;
  isSeeding = true;
  
  try {
    const allCategories = await db.categories.toArray();
    
    if (allCategories.length === 0) {
      await db.categories.bulkAdd(DEFAULT_CATEGORIES);
    } else {
      // Clean up any existing duplicates (caused by React Strict Mode double-mounting race condition)
      const seen = new Set();
      const toDelete = [];
      
      for (const cat of allCategories) {
        if (seen.has(cat.name)) {
          toDelete.push(cat.id);
        } else {
          seen.add(cat.name);
        }
      }
      
      if (toDelete.length > 0) {
        await db.categories.bulkDelete(toDelete);
      }
    }
  } finally {
    isSeeding = false;
  }
}

export { DEFAULT_CATEGORIES };
