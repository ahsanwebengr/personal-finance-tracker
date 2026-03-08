import Dexie from 'dexie';

const db = new Dexie('FinTrackDB');

db.version(1).stores({
  transactions: '++id, type, amount, category, date, createdAt',
  categories: '++id, name, type, icon, isDefault',
});

export default db;
