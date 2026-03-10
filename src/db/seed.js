import db from './db';

const DEFAULT_CATEGORIES = [
  { name: 'Salary', type: 'income', icon: '💰', isDefault: true },
  { name: 'Freelance', type: 'income', icon: '💻', isDefault: true },
  { name: 'Investment', type: 'income', icon: '📈', isDefault: true },
  { name: 'Other Income', type: 'income', icon: '🎁', isDefault: true },
  
  // Expenses
  { name: 'Rent', type: 'expense', icon: '🏠', isDefault: true },
  { name: 'Electricity', type: 'expense', icon: '⚡', isDefault: true },
  { name: 'Gas', type: 'expense', icon: '🔥', isDefault: true },
  { name: 'Internet', type: 'expense', icon: '🌐', isDefault: true },
  { name: 'Mobile bill', type: 'expense', icon: '📱', isDefault: true },
  { name: 'Groceries', type: 'expense', icon: '🛒', isDefault: true },
  { name: 'Food', type: 'expense', icon: '🍔', isDefault: true },
  { name: 'Fuel', type: 'expense', icon: '⛽', isDefault: true },
  { name: 'Transport', type: 'expense', icon: '🚗', isDefault: true },
  { name: 'Car or bike maintenance', type: 'expense', icon: '🔧', isDefault: true },
  { name: 'Medicines', type: 'expense', icon: '💊', isDefault: true },
  { name: 'Doctor visit', type: 'expense', icon: '🏥', isDefault: true },
  { name: 'Clothes', type: 'expense', icon: '👕', isDefault: true },
  { name: 'Personal care', type: 'expense', icon: '🧴', isDefault: true },
  { name: 'Family support', type: 'expense', icon: '👪', isDefault: true },
  { name: 'Entertainment', type: 'expense', icon: '🎮', isDefault: true },
  { name: 'Subscriptions', type: 'expense', icon: '📺', isDefault: true },
  { name: 'Gifts / charity', type: 'expense', icon: '🎁', isDefault: true },
  { name: 'Education', type: 'expense', icon: '📚', isDefault: true },
  { name: 'Bills', type: 'expense', icon: '📄', isDefault: true },
  { name: 'Shopping', type: 'expense', icon: '🛍️', isDefault: true },
  { name: 'Other', type: 'expense', icon: '📦', isDefault: true },
];

let isSeeding = false;

export async function seedCategories() {
  if (isSeeding) return;
  isSeeding = true;
  
  try {
    const allCategories = await db.categories.toArray();
    
    // Check and add missing default categories
    const existingNames = new Set(allCategories.map(c => c.name));
    const missingDefaults = DEFAULT_CATEGORIES.filter(c => !existingNames.has(c.name));
    
    if (missingDefaults.length > 0) {
      await db.categories.bulkAdd(missingDefaults);
    }
    
    // Clean up any existing duplicates (caused by React Strict Mode double-mounting)
    const seen = new Set();
    const toDelete = [];
    
    const currentCategories = await db.categories.toArray();
    for (const cat of currentCategories) {
      if (seen.has(cat.name)) {
        toDelete.push(cat.id);
      } else {
        seen.add(cat.name);
      }
    }
    
    if (toDelete.length > 0) {
      await db.categories.bulkDelete(toDelete);
    }
  } finally {
    isSeeding = false;
  }
}

export { DEFAULT_CATEGORIES };
