import {
  CheckCircle2,
  Plus,
  Timer,
  Trash2,
  X,
} from 'lucide-react';
import { createPortal } from 'react-dom';

const ACTION_ICONS = {
  PROJECT_CREATED: { icon: CheckCircle2, bg: 'rgba(5,150,105,0.1)', clr: '#059669' },
  MEMBER_ADDED: { icon: Plus, bg: 'rgba(79,70,229,0.1)', clr: '#4f46e5' },
  TASK_CREATED: { icon: Plus, bg: 'rgba(5,150,105,0.1)', clr: '#059669' },
  TASK_UPDATED: { icon: Timer, bg: 'rgba(234,88,12,0.1)', clr: '#ea580c' },
  TASK_DELETED: { icon: Trash2, bg: 'rgba(225,29,72,0.1)', clr: '#e11d48' },
  STATUS_CHANGED: { icon: CheckCircle2, bg: 'rgba(79,70,229,0.1)', clr: '#4f46e5' },
  ASSIGNMENT_CHANGED: { icon: Plus, bg: 'rgba(124,58,237,0.1)', clr: '#7c3aed' },
};

const ActivityFeedContent = ({ activities, loading, onCloseMobile }) => (
  <>
    <div className="px-5 py-4 border-b border-slate-200 dark:border-dark-border flex items-center justify-between shrink-0">
      <h3
        className="font-bold text-slate-900 dark:text-white"
        style={{ fontFamily: 'var(--font-heading)' }}
      >
        Activity
      </h3>
      {onCloseMobile && (
        <button onClick={onCloseMobile} className="lg:hidden p-1 text-slate-400 dark:text-slate-500 hover:bg-slate-100 dark:hover:bg-dark-hover rounded-lg">
          <X size={18} />
        </button>
      )}
    </div>
    <div className="flex-1 overflow-y-auto p-5 space-y-5">
      {loading && (
        <p className="text-sm text-slate-400 dark:text-slate-500 text-center py-8">Loading…</p>
      )}
      {!loading && activities.length === 0 && (
        <p className="text-sm text-slate-400 dark:text-slate-500 text-center py-8">
          No activity yet
        </p>
      )}
      {activities.map((item) => {
        const config = ACTION_ICONS[item.action] || ACTION_ICONS.TASK_UPDATED;
        const IconComp = config.icon;
        return (
          <div key={item._id} className="flex gap-3">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
              style={{ background: config.bg }}
            >
              <IconComp size={16} style={{ color: config.clr }} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-slate-700 dark:text-slate-300">
                <span className="font-semibold text-slate-900 dark:text-white">
                  {item.user?.name || 'Unknown'}
                </span>{' '}
                {item.details}
              </p>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                {new Date(item.createdAt).toLocaleDateString()}{' '}
                {new Date(item.createdAt).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  </>
);

const ActivityFeed = ({ activities = [], loading = false, mobileOpen = false, onCloseMobile }) => {
  return (
    <>
      {/* Desktop Sidebar (in-flow) */}
      <aside className="hidden lg:flex flex-col w-72 xl:w-80 bg-white dark:bg-dark-surface border-l border-slate-200 dark:border-dark-border overflow-hidden shrink-0">
        <ActivityFeedContent activities={activities} loading={loading} />
      </aside>

      {/* Mobile Drawer (Portal to document.body to avoid clipping) */}
      {mobileOpen && typeof document !== 'undefined' && createPortal(
        <div className="lg:hidden">
          <div className="fixed inset-0 bg-black/30 z-40 animate-fade-in" onClick={onCloseMobile} />
          <aside className="fixed inset-y-0 right-0 z-50 flex flex-col w-72 sm:w-80 bg-white dark:bg-dark-surface border-l border-slate-200 dark:border-dark-border shadow-xl animate-slide-in-right">
            <ActivityFeedContent activities={activities} loading={loading} onCloseMobile={onCloseMobile} />
          </aside>
        </div>,
        document.body
      )}
    </>
  );
};

export default ActivityFeed;
