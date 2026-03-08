import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTransactions } from '../hooks/useTransactions';
import { useCategories } from '../hooks/useCategories';
import { toInputDate } from '../utils/dates';
import { ArrowLeft, Check } from 'lucide-react';

export default function TransactionForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);

  const { addTransaction, updateTransaction, getTransaction } = useTransactions();
  const [type, setType] = useState('expense');
  const { categories } = useCategories(type);

  const [form, setForm] = useState({
    type: 'expense',
    amount: '',
    category: '',
    note: '',
    date: toInputDate(),
  });

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isEditing) {
      getTransaction(Number(id)).then(t => {
        if (t) {
          setForm({
            type: t.type,
            amount: String(t.amount),
            category: t.category,
            note: t.note || '',
            date: toInputDate(t.date),
          });
          setType(t.type);
        }
      });
    }
  }, [id, isEditing, getTransaction]);

  const handleTypeChange = (newType) => {
    setType(newType);
    setForm(prev => ({ ...prev, type: newType, category: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.amount || !form.category) return;

    setSaving(true);
    try {
      if (isEditing) {
        await updateTransaction(Number(id), form);
      } else {
        await addTransaction(form);
      }
      navigate(-1);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="pt-2 pb-4">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-surface-800 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-surface-700 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">
          {isEditing ? 'Edit Transaction' : 'Add Transaction'}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Type Toggle */}
        <div className="bg-gray-100 dark:bg-surface-800 rounded-xl p-1 flex">
          <button
            type="button"
            className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
              type === 'expense'
                ? 'bg-rose-500 text-white shadow-md shadow-rose-500/25'
                : 'text-gray-500 dark:text-gray-400'
            }`}
            onClick={() => handleTypeChange('expense')}
          >
            Expense
          </button>
          <button
            type="button"
            className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
              type === 'income'
                ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/25'
                : 'text-gray-500 dark:text-gray-400'
            }`}
            onClick={() => handleTypeChange('income')}
          >
            Income
          </button>
        </div>

        {/* Amount */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Amount</label>
          <input
            type="number"
            step="0.01"
            min="0"
            placeholder="0.00"
            value={form.amount}
            onChange={e => setForm({ ...form, amount: e.target.value })}
            className="input-field text-2xl font-bold text-center py-4"
            required
            id="input-amount"
            autoFocus
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Category</label>
          <div className="grid grid-cols-3 gap-2">
            {categories.map(cat => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setForm({ ...form, category: cat.name })}
                className={`flex flex-col items-center gap-1 py-3 rounded-xl text-xs font-medium transition-all duration-200 ${
                  form.category === cat.name
                    ? type === 'income'
                      ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 ring-2 ring-emerald-500/50'
                      : 'bg-rose-100 dark:bg-rose-900/40 text-rose-700 dark:text-rose-300 ring-2 ring-rose-500/50'
                    : 'bg-gray-50 dark:bg-surface-800 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-surface-700'
                }`}
              >
                <span className="text-lg">{cat.icon}</span>
                <span className="truncate w-full text-center px-1">{cat.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Note */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Note (optional)</label>
          <input
            type="text"
            placeholder="Add a note..."
            value={form.note}
            onChange={e => setForm({ ...form, note: e.target.value })}
            className="input-field"
            id="input-note"
          />
        </div>

        {/* Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Date</label>
          <input
            type="date"
            value={form.date}
            onChange={e => setForm({ ...form, date: e.target.value })}
            className="input-field"
            required
            id="input-date"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={saving || !form.amount || !form.category}
          className={`w-full py-4 rounded-xl text-white font-bold text-base transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.97] ${
            type === 'income'
              ? 'bg-emerald-500 hover:bg-emerald-600 shadow-lg shadow-emerald-500/25'
              : 'bg-rose-500 hover:bg-rose-600 shadow-lg shadow-rose-500/25'
          }`}
          id="btn-save-transaction"
        >
          <Check className="w-5 h-5" />
          {saving ? 'Saving...' : isEditing ? 'Update Transaction' : 'Add Transaction'}
        </button>
      </form>
    </div>
  );
}
