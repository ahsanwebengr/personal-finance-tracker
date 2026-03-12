import { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useCurrency } from '../context/CurrencyContext';
import { getCurrencies } from '../utils/currency';
import db from '../db/db';
import { seedCategories } from '../db/seed';
import {
  Download, Upload, Moon, Sun, DollarSign, Trash2, AlertTriangle,
  CheckCircle2, Info,
} from 'lucide-react';
import Select from '@/components/Select';

export default function Settings() {
  const { isDark, toggleTheme } = useTheme();
  const { currency, setCurrency } = useCurrency();
  const [notification, setNotification] = useState(null);

  const showNotification = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

  // Backup
  const handleExport = async () => {
    try {
      const transactions = await db.transactions.toArray();
      const categories = await db.categories.toArray();
      const data = {
        version: 1,
        exportedAt: new Date().toISOString(),
        app: 'Mera Hisab',
        transactions,
        categories,
        settings: { currency },
      };
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `merahisab-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      showNotification('success', 'Backup downloaded successfully!');
    } catch (err) {
      showNotification('error', 'Failed to export data.');
      console.error(err);
    }
  };

  // Restore
  const handleImport = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const text = await file.text();
      const data = JSON.parse(text);

      if (!data.transactions || !data.categories) {
        throw new Error('Invalid backup file');
      }

      const confirmRestore = window.confirm(
        `This will replace ALL your data with:\n• ${data.transactions.length} transactions\n• ${data.categories.length} categories\n\nContinue?`
      );

      if (!confirmRestore) return;

      await db.transactions.clear();
      await db.categories.clear();

      // Remove IDs to let Dexie auto-generate them
      const txns = data.transactions.map(({ id, ...rest }) => rest);
      const cats = data.categories.map(({ id, ...rest }) => rest);

      await db.categories.bulkAdd(cats);
      await db.transactions.bulkAdd(txns);

      if (data.settings?.currency) {
        setCurrency(data.settings.currency);
      }

      showNotification('success', `Restored ${data.transactions.length} transactions!`);
    } catch (err) {
      showNotification('error', 'Failed to import: ' + err.message);
      console.error(err);
    }

    e.target.value = '';
  };

  // Clear all data
  const handleClearData = async () => {
    const confirm1 = window.confirm('Are you sure you want to delete ALL data? This cannot be undone!');
    if (!confirm1) return;
    const confirm2 = window.confirm('This is your last chance. All transactions and custom categories will be permanently deleted.');
    if (!confirm2) return;

    await db.transactions.clear();
    await db.categories.clear();
    await seedCategories();
    showNotification('success', 'All data cleared.');
  };

  const currencies = getCurrencies();

  return (
    <div className="space-y-5 pt-2 pb-4">
      <h1 className="text-xl font-bold text-gray-900 dark:text-white">Settings</h1>

      {/* Notification */}
      {notification && (
        <div
          className={`flex items-center gap-2 p-3 rounded-xl text-sm font-medium animate-slide-down ${
            notification.type === 'success'
              ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300'
              : 'bg-rose-50 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300'
          }`}
        >
          {notification.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 shrink-0" />
          ) : (
            <AlertTriangle className="w-4 h-4 shrink-0" />
          )}
          {notification.message}
        </div>
      )}

      {/* Appearance */}
      <div className="card">
        <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">Appearance</h2>
        <button
          onClick={toggleTheme}
          className="w-full flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-surface-700 hover:bg-gray-100 dark:hover:bg-surface-600 transition-colors"
          id="btn-toggle-theme"
        >
          <div className="flex items-center gap-3">
            {isDark ? <Moon className="w-5 h-5 text-primary-400" /> : <Sun className="w-5 h-5 text-amber-500" />}
            <span className="font-medium text-sm text-gray-700 dark:text-gray-200">
              {isDark ? 'Dark Mode' : 'Light Mode'}
            </span>
          </div>
          <div
            className={`w-12 h-6 rounded-full relative transition-colors duration-300 ${
              isDark ? 'bg-primary-500' : 'bg-gray-300'
            }`}
          >
            <div
              className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform duration-300 ${
                isDark ? 'translate-x-6' : 'translate-x-0.5'
              }`}
            />
          </div>
        </button>
      </div>

      {/* Currency */}
      <div className="card">
        <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">Currency</h2>
        <div className="flex items-center gap-3 mb-2">
          <DollarSign className="w-5 h-5 text-primary-500" />
          <Select
            value={currency}
            onChange={setCurrency}
            className="flex-1"
            options={currencies.map(c => ({
              label: `${c.symbol} ${c.name} (${c.code})`,
              value: c.code
            }))}
            id="select-currency"
          />
        </div>
      </div>

      {/* Backup & Restore */}
      <div className="card space-y-3">
        <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Backup & Restore</h2>

        <div className="flex items-start gap-2 p-2.5 rounded-lg bg-blue-50 dark:bg-blue-900/20">
          <Info className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
          <p className="text-xs text-blue-700 dark:text-blue-300">
            Export your data as a JSON file for safekeeping. You can restore it anytime.
          </p>
        </div>

        <button
          onClick={handleExport}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 font-semibold text-sm hover:bg-emerald-100 dark:hover:bg-emerald-900/40 transition-colors"
          id="btn-export"
        >
          <Download className="w-4 h-4" />
          Export Backup
        </button>

        <label className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 font-semibold text-sm hover:bg-primary-100 dark:hover:bg-primary-900/40 transition-colors cursor-pointer">
          <Upload className="w-4 h-4" />
          Import Backup
          <input
            type="file"
            accept=".json"
            onChange={handleImport}
            className="hidden"
            id="input-import"
          />
        </label>
      </div>

      {/* Danger Zone */}
      <div className="card border-rose-200 dark:border-rose-800/30">
        <h2 className="text-sm font-semibold text-rose-500 uppercase tracking-wider mb-3">Danger Zone</h2>
        <button
          onClick={handleClearData}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 font-semibold text-sm hover:bg-rose-100 dark:hover:bg-rose-900/40 transition-colors"
          id="btn-clear-data"
        >
          <Trash2 className="w-4 h-4" />
          Clear All Data
        </button>
      </div>

      {/* Footer */}
      <div className="text-center py-4">
        <p className="text-xs text-gray-400 dark:text-gray-600">Mera Hisab v1.0.0</p>
        <p className="text-[10px] text-gray-300 dark:text-gray-700 mt-1">All data stored locally on your device</p>
      </div>
    </div>
  );
}
