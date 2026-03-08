import { Outlet } from 'react-router-dom';
import BottomNav from './BottomNav';

export default function Layout() {
  return (
    <div className="min-h-screen max-w-lg mx-auto relative">
      <main className="pb-24 px-4 pt-2">
        <div className="page-enter">
          <Outlet />
        </div>
      </main>
      <BottomNav />
    </div>
  );
}
