import { useState } from 'react';
import { useCategories } from '../hooks/useCategories';
import { Plus, Trash2, ShieldCheck, X } from 'lucide-react';

export default function Categories() {
  const { categories: incomeCategories, addCategory, deleteCategory } = useCategories('income');
  const { categories: expenseCategories } = useCategories('expense');
  const [showForm, setShowForm] = useState(false);
  const [newCat, setNewCat] = useState({ name: '', type: 'expense', icon: '📦' });

  const EMOJI_OPTIONS = ['🍕', '🚕', '🏠', '💡', '🎬', '📱', '✈️', '🏋️', '💳', '🎶', '📦', '🛒', '💼', '🎨', '🔧', '💸'];

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newCat.name.trim()) return;
    await addCategory(newCat);
    setNewCat({ name: '', type: 'expense', icon: '📦' });
    setShowForm(false);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this category?')) {
      try {
        await deleteCategory(id);
      } catch (err) {
        alert(err.message);
      }
    }
  };

  return (
    <div className="space-y-5 pt-2 pb-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">Categories</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="w-10 h-10 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 dark:text-primary-400 hover:bg-primary-200 dark:hover:bg-primary-900/50 transition-colors"
        >
          {showForm ? <X className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
        </button>
      </div>

      {/* Add Form */}
      {showForm && (
        <form onSubmit={handleAdd} className="card space-y-3 animate-slide-down">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">New Category</h3>
          <input
            type="text"
            placeholder="Category name"
            value={newCat.name}
            onChange={e => setNewCat({ ...newCat, name: e.target.value })}
            className="input-field"
            id="input-new-category"
            required
          />
          <select
            value={newCat.type}
            onChange={e => setNewCat({ ...newCat, type: e.target.value })}
            className="input-field"
            id="select-category-type"
          >
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>

          {/* Emoji Picker */}
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Choose an icon</p>
            <div className="flex flex-wrap gap-2">
              {EMOJI_OPTIONS.map(emoji => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => setNewCat({ ...newCat, icon: emoji })}
                  className={`w-10 h-10 rounded-lg flex items-center justify-center text-lg transition-all ${
                    newCat.icon === emoji
                      ? 'bg-primary-100 dark:bg-primary-900/40 ring-2 ring-primary-500/50 scale-110'
                      : 'bg-gray-50 dark:bg-surface-800 hover:bg-gray-100 dark:hover:bg-surface-700'
                  }`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          <button type="submit" className="btn-primary w-full" id="btn-add-category">
            Add Category
          </button>
        </form>
      )}

      {/* Expense Categories */}
      <div>
        <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">Expense</h2>
        <div className="space-y-2">
          {expenseCategories.map(cat => (
            <CategoryItem key={cat.id} category={cat} onDelete={handleDelete} />
          ))}
        </div>
      </div>

      {/* Income Categories */}
      <div>
        <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">Income</h2>
        <div className="space-y-2">
          {incomeCategories.map(cat => (
            <CategoryItem key={cat.id} category={cat} onDelete={handleDelete} />
          ))}
        </div>
      </div>
    </div>
  );
}

function CategoryItem({ category, onDelete }) {
  return (
    <div className="card flex items-center gap-3 !p-3">
      <div className="w-10 h-10 rounded-xl bg-gray-50 dark:bg-surface-700 flex items-center justify-center text-lg">
        {category.icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-sm text-gray-900 dark:text-gray-100">{category.name}</p>
        <div className="flex items-center gap-1 mt-0.5">
          {category.isDefault && (
            <span className="inline-flex items-center gap-0.5 text-[10px] text-primary-500 font-medium">
              <ShieldCheck className="w-3 h-3" /> Default
            </span>
          )}
        </div>
      </div>
      {!category.isDefault && (
        <button
          onClick={() => onDelete(category.id)}
          className="p-2 rounded-lg text-gray-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/30 transition-colors"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
