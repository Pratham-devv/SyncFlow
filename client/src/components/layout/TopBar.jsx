import { useLocation } from 'react-router-dom';
import { Menu, Search, Bell, ChevronRight, Moon, Sun } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

const TITLES = {
  '/': 'Dashboard',
  '/tasks': 'My Tasks',
  '/projects': 'Projects',
  '/settings': 'Settings',
};

const TopBar = ({ onMenu }) => {
  const { pathname } = useLocation();
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const title = TITLES[pathname] || 'SyncFlow';

  return (
    <header
      className="sticky top-0 z-30 border-b border-slate-200 dark:border-dark-border flex items-center gap-4 px-4 md:px-6 py-3 bg-white/90 dark:bg-dark-surface/90 backdrop-blur-xl transition-colors duration-300"
    >
      <button
        className="lg:hidden p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-dark-hover transition-colors"
        onClick={onMenu}
      >
        <Menu size={20} />
      </button>

      <div className="hidden sm:flex items-center gap-2">
        <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">SyncFlow</span>
        <ChevronRight size={14} className="text-slate-300 dark:text-slate-600" />
        <span
          className="text-sm font-bold text-slate-700 dark:text-white"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          {title}
        </span>
      </div>

      <div className="flex-1" />

      {/* Search */}
      <div className="hidden sm:flex items-center bg-slate-100 dark:bg-dark-card rounded-xl px-3 py-2 gap-2 w-56 border border-transparent focus-within:bg-white dark:focus-within:bg-dark-hover focus-within:border-brand-300 dark:focus-within:border-brand-500 focus-within:ring-2 focus-within:ring-brand-200 dark:focus-within:ring-brand-500/20 transition-all">
        <Search size={16} className="text-slate-400 dark:text-slate-500" />
        <input
          type="text"
          placeholder="Search anything…"
          className="bg-transparent text-sm text-slate-700 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 outline-none w-full"
        />
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1">
        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-dark-hover transition-colors cursor-pointer"
          title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        <button className="relative p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-dark-hover transition-colors">
          <Bell size={20} />
        </button>
        {user && (
          <div className="w-8 h-8 rounded-full bg-brand-100 dark:bg-brand-500/20 flex items-center justify-center text-brand-700 dark:text-brand-300 font-bold text-sm ml-1 cursor-pointer">
            {user.name?.charAt(0).toUpperCase()}
          </div>
        )}
      </div>
    </header>
  );
};

export default TopBar;
