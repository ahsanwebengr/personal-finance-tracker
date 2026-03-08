export default function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="relative">
        <div className="w-10 h-10 rounded-full border-3 border-gray-200 dark:border-gray-700"></div>
        <div className="w-10 h-10 rounded-full border-3 border-primary-500 border-t-transparent animate-spin absolute inset-0"></div>
      </div>
    </div>
  );
}
