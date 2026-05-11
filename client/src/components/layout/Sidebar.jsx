import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  CheckSquare,
  FolderKanban,
  Settings,
  Plus,
  HelpCircle,
  Archive,
  ChevronDown,
  RefreshCw,
  LogOut,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { NAV_ITEMS } from '../../constants';

const ICON_MAP = {
  LayoutDashboard,
  CheckSquare,
  FolderKanban,
  Settings,
};

const Sidebar = ({ open, onClose }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/30 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-white dark:bg-dark-surface border-r border-slate-200 dark:border-dark-border z-50 flex flex-col transition-all duration-300 ease-in-out ${
          open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Brand */}
        <div className="flex items-center gap-3 px-5 py-5 border-b border-slate-100 dark:border-dark-border">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center text-white shrink-0"
            style={{ background: 'linear-gradient(135deg, #3730a3, #4f46e5)' }}
          >
            <RefreshCw size={18} />
          </div>
          <div>
            <div
              className="font-bold text-slate-900 dark:text-white text-base leading-none"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              SyncFlow
            </div>
            <div className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
              Collaborative Workspace
            </div>
          </div>
        </div>

        {/* New project — navigates to /projects with create flag */}
        <div className="p-4">
          <button
            onClick={() => {
              navigate('/projects?create=true');
              onClose?.();
            }}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold text-white hover:opacity-90 active:scale-95 transition-all cursor-pointer"
            style={{ background: 'linear-gradient(135deg, #3730a3, #4f46e5)' }}
          >
            <Plus size={18} />
            New Project
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 space-y-0.5 overflow-y-auto">
          {NAV_ITEMS.map(({ icon, label, path }) => {
            const IconComponent = ICON_MAP[icon];
            return (
              <NavLink
                key={path}
                to={path}
                onClick={onClose}
                className={({ isActive }) =>
                  `w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-150 ${
                    isActive
                      ? 'bg-brand-50 dark:bg-brand-500/10 text-brand-700 dark:text-brand-300 font-bold'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-dark-hover hover:text-slate-900 dark:hover:text-white'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <IconComponent
                      size={20}
                      className={isActive ? 'text-brand-600 dark:text-brand-400' : 'text-slate-400 dark:text-slate-500'}
                    />
                    <span className="flex-1 text-left">{label}</span>
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Bottom */}
        <div className="p-3 border-t border-slate-100 dark:border-dark-border space-y-0.5">
          <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-dark-hover hover:text-slate-700 dark:hover:text-white transition-colors">
            <HelpCircle size={18} className="text-slate-400 dark:text-slate-500" />
            Help
          </button>
          <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-dark-hover hover:text-slate-700 dark:hover:text-white transition-colors">
            <Archive size={18} className="text-slate-400 dark:text-slate-500" />
            Archive
          </button>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-600 dark:hover:text-red-300 transition-colors cursor-pointer"
          >
            <LogOut size={18} />
            Logout
          </button>

          {/* User row */}
          {user && (
            <div className="flex items-center gap-3 px-3 py-2.5 mt-1 rounded-xl hover:bg-slate-50 dark:hover:bg-dark-hover cursor-pointer transition-colors">
              <div className="w-8 h-8 rounded-full bg-brand-100 dark:bg-brand-500/20 flex items-center justify-center text-brand-700 dark:text-brand-300 font-bold text-sm shrink-0">
                {user.name?.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-bold text-slate-800 dark:text-white truncate">
                  {user.name}
                </div>
                <div className="text-xs text-slate-400 dark:text-slate-500 truncate">
                  {user.email}
                </div>
              </div>
              <ChevronDown size={16} className="text-slate-400 dark:text-slate-500" />
            </div>
          )}
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
