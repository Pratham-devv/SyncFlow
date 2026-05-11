import { useLocation } from 'react-router-dom';
import { Menu, Search, Bell, ChevronRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const TITLES = {
  '/': 'Dashboard',
  '/tasks': 'My Tasks',
  '/projects': 'Projects',
  '/settings': 'Settings',
};

const TopBar = ({ onMenu }) => {
  const { pathname } = useLocation();
  const { user } = useAuth();
  const title = TITLES[pathname] || 'SyncFlow';

  return (
    <header
      className="sticky top-0 z-30 border-b border-slate-200 flex items-center gap-4 px-4 md:px-6 py-3"
      style={{ background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(12px)' }}
    >
      <button
        className="lg:hidden p-2 rounded-xl text-slate-500 hover:bg-slate-100 transition-colors"
        onClick={onMenu}
      >
        <Menu size={20} />
      </button>

      <div className="hidden sm:flex items-center gap-2">
        <span className="text-xs text-slate-400 font-medium">SyncFlow</span>
        <ChevronRight size={14} className="text-slate-300" />
        <span
          className="text-sm font-bold text-slate-700"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          {title}
        </span>
      </div>

      <div className="flex-1" />

      {/* Search */}
      <div className="hidden sm:flex items-center bg-slate-100 rounded-xl px-3 py-2 gap-2 w-56 border border-transparent focus-within:bg-white focus-within:border-brand-300 focus-within:ring-2 focus-within:ring-brand-200 transition-all">
        <Search size={16} className="text-slate-400" />
        <input
          type="text"
          placeholder="Search anything…"
          className="bg-transparent text-sm text-slate-700 placeholder-slate-400 outline-none w-full"
        />
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1">
        <button className="relative p-2 rounded-xl text-slate-500 hover:bg-slate-100 transition-colors">
          <Bell size={20} />
        </button>
        {user && (
          <div className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center text-brand-700 font-bold text-sm ml-1 cursor-pointer">
            {user.name?.charAt(0).toUpperCase()}
          </div>
        )}
      </div>
    </header>
  );
};

export default TopBar;
