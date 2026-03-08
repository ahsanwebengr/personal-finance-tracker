import { NavLink } from 'react-router-dom';
import { LayoutDashboard, ArrowLeftRight, PlusCircle, Tag, Settings } from 'lucide-react';

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Home' },
  { to: '/transactions', icon: ArrowLeftRight, label: 'History' },
  { to: '/add', icon: PlusCircle, label: 'Add', isCenter: true },
  { to: '/categories', icon: Tag, label: 'Categories' },
  { to: '/settings', icon: Settings, label: 'Settings' },
];

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/90 dark:bg-surface-900/90 backdrop-blur-xl border-t border-gray-200/50 dark:border-gray-800/50 pb-[env(safe-area-inset-bottom)]">
      <div className="flex items-center justify-around max-w-lg mx-auto px-2 h-16">
        {navItems.map(({ to, icon: Icon, label, isCenter }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center gap-0.5 w-16 py-1 transition-all duration-200 ${
                isCenter
                  ? ''
                  : isActive
                  ? 'text-primary-500'
                  : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300'
              }`
            }
          >
            {({ isActive }) =>
              isCenter ? (
                <div className="w-12 h-12 rounded-full gradient-balance flex items-center justify-center shadow-lg shadow-primary-500/30 -mt-4 active:scale-90 transition-transform">
                  <Icon className="w-6 h-6 text-white" />
                </div>
              ) : (
                <>
                  <Icon
                    className={`w-5 h-5 transition-all duration-200 ${
                      isActive ? 'scale-110' : ''
                    }`}
                    strokeWidth={isActive ? 2.5 : 1.8}
                  />
                  <span
                    className={`text-[10px] font-medium ${
                      isActive ? 'text-primary-500' : ''
                    }`}
                  >
                    {label}
                  </span>
                </>
              )
            }
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
