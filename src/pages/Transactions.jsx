import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTransactions } from '../hooks/useTransactions';
import { useCategories } from '../hooks/useCategories';
import TransactionCard from '../components/TransactionCard';
import EmptyState from '../components/EmptyState';
import LoadingSpinner from '../components/LoadingSpinner';
import { Search, SlidersHorizontal, X } from 'lucide-react';

export default function Transactions() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filterCategory, setFilterCategory] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterStartDate, setFilterStartDate] = useState('');
  const [filterEndDate, setFilterEndDate] = useState('');

  const { transactions, deleteTransaction, isLoading } = useTransactions({
    search,
    category: filterCategory,
    type: filterType,
    startDate: filterStartDate,
    endDate: filterEndDate,
  });

  const { categories } = useCategories();

  const hasActiveFilters = filterCategory || filterType || filterStartDate || filterEndDate;

  const handleEdit = (transaction) => {
    navigate(`/edit/${transaction.id}`);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this transaction?')) {
      await deleteTransaction(id);
    }
  };

  const clearFilters = () => {
    setFilterCategory('');
    setFilterType('');
    setFilterStartDate('');
    setFilterEndDate('');
  };

  // Group transactions by date
  const grouped = useMemo(() => {
    const groups = {};
    transactions.forEach(t => {
      const dateKey = t.date;
      if (!groups[dateKey]) groups[dateKey] = [];
      groups[dateKey].push(t);
    });
    return Object.entries(groups).sort(([a], [b]) => b.localeCompare(a));
  }, [transactions]);

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="space-y-4 pt-2 pb-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">Transactions</h1>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`relative p-2 rounded-xl transition-colors ${
            showFilters || hasActiveFilters
              ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400'
              : 'bg-gray-100 dark:bg-surface-800 text-gray-500'
          }`}
        >
          <SlidersHorizontal className="w-5 h-5" />
          {hasActiveFilters && (
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-primary-500 rounded-full" />
          )}
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search transactions..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="input-field pl-10 pr-10"
          id="search-transactions"
        />
        {search && (
          <button
            onClick={() => setSearch('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="card space-y-3 animate-slide-down">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Filters</span>
            {hasActiveFilters && (
              <button onClick={clearFilters} className="text-xs text-primary-500 font-medium">Clear all</button>
            )}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <select
              value={filterType}
              onChange={e => setFilterType(e.target.value)}
              className="input-field text-sm"
              id="filter-type"
            >
              <option value="">All Types</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
            <select
              value={filterCategory}
              onChange={e => setFilterCategory(e.target.value)}
              className="input-field text-sm"
              id="filter-category"
            >
              <option value="">All Categories</option>
              {categories.map(c => (
                <option key={c.id} value={c.name}>{c.icon} {c.name}</option>
              ))}
            </select>
            <input
              type="date"
              value={filterStartDate}
              onChange={e => setFilterStartDate(e.target.value)}
              className="input-field text-sm"
              placeholder="Start date"
              id="filter-start-date"
            />
            <input
              type="date"
              value={filterEndDate}
              onChange={e => setFilterEndDate(e.target.value)}
              className="input-field text-sm"
              placeholder="End date"
              id="filter-end-date"
            />
          </div>
        </div>
      )}

      {/* Transaction Count */}
      <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
        {transactions.length} transaction{transactions.length !== 1 ? 's' : ''}
        {hasActiveFilters ? ' (filtered)' : ''}
      </p>

      {/* List */}
      {transactions.length === 0 ? (
        <EmptyState
          icon="📝"
          title={hasActiveFilters || search ? 'No matches' : 'No transactions yet'}
          description={
            hasActiveFilters || search
              ? 'Try adjusting your search or filters'
              : 'Tap the + button to add your first transaction'
          }
        />
      ) : (
        <div className="space-y-2">
          {grouped.map(([date, txns]) => (
            <div key={date}>
              <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2 ml-1">
                {new Date(date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
              </p>
              <div className="space-y-2">
                {txns.map(t => (
                  <TransactionCard
                    key={t.id}
                    transaction={t}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
