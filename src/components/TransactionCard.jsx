import { useCurrency } from '../context/CurrencyContext';
import { formatCurrency } from '../utils/currency';
import { formatDate } from '../utils/dates';
import { Trash2, Edit3 } from 'lucide-react';
import { useState } from 'react';

export default function TransactionCard({ transaction, onEdit, onDelete }) {
  const { currency } = useCurrency();
  const [showActions, setShowActions] = useState(false);
  const isIncome = transaction.type === 'income';

  return (
    <div
      className="card group cursor-pointer hover:shadow-md active:scale-[0.98] transition-all duration-200"
      onClick={() => setShowActions(!showActions)}
    >
      <div className="flex items-center gap-3">
        {/* Category Icon */}
        <div
          className={`w-11 h-11 rounded-xl flex items-center justify-center text-lg shrink-0 ${
            isIncome
              ? 'bg-emerald-50 dark:bg-emerald-900/30'
              : 'bg-rose-50 dark:bg-rose-900/30'
          }`}
        >
          {getCategoryEmoji(transaction.category)}
        </div>

        {/* Details */}
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm text-gray-900 dark:text-gray-100 truncate">
            {transaction.category}
          </p>
          {transaction.note && (
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5">
              {transaction.note}
            </p>
          )}
        </div>

        {/* Amount & Date */}
        <div className="text-right shrink-0">
          <p
            className={`font-bold text-sm ${
              isIncome ? 'text-emerald-500' : 'text-rose-500'
            }`}
          >
            {isIncome ? '+' : '-'}{formatCurrency(transaction.amount, currency)}
          </p>
          <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-0.5">
            {formatDate(transaction.date)}
          </p>
        </div>
      </div>

      {/* Action buttons */}
      {showActions && (
        <div className="flex gap-2 mt-3 pt-3 border-t border-gray-100 dark:border-gray-700 animate-fade-in">
          <button
            onClick={(e) => { e.stopPropagation(); onEdit?.(transaction); }}
            className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 text-sm font-medium hover:bg-primary-100 dark:hover:bg-primary-900/50 transition-colors"
          >
            <Edit3 className="w-4 h-4" />
            Edit
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onDelete?.(transaction.id); }}
            className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg bg-rose-50 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 text-sm font-medium hover:bg-rose-100 dark:hover:bg-rose-900/50 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            Delete
          </button>
        </div>
      )}
    </div>
  );
}

function getCategoryEmoji(category) {
  const map = {
    'Salary': '💰',
    'Freelance': '💻',
    'Investment': '📈',
    'Other Income': '🎁',
    'Food': '🍔',
    'Transport': '🚗',
    'Shopping': '🛍️',
    'Bills': '📄',
    'Entertainment': '🎮',
    'Health': '💊',
    'Education': '📚',
    'Other': '📦',
  };
  return map[category] || '💸';
}
