export default function EmptyState({ icon, title, description }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 animate-fade-in">
      <div className="w-20 h-20 rounded-full bg-gray-100 dark:bg-surface-800 flex items-center justify-center mb-4">
        <span className="text-4xl">{icon || '📊'}</span>
      </div>
      <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-1">
        {title || 'No data yet'}
      </h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 text-center max-w-xs">
        {description || 'Start adding transactions to see your financial overview'}
      </p>
    </div>
  );
}
