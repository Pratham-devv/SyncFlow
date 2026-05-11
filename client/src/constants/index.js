export const NAV_ITEMS = [
  { icon: 'LayoutDashboard', label: 'Dashboard', path: '/' },
  { icon: 'CheckSquare', label: 'My Tasks', path: '/tasks' },
  { icon: 'FolderKanban', label: 'Projects', path: '/projects' },
  { icon: 'Settings', label: 'Settings', path: '/settings' },
];

export const TASK_STATUS = {
  TODO: 'Todo',
  IN_PROGRESS: 'In Progress',
  DONE: 'Done',
};

export const PRIORITY_OPTIONS = ['Low', 'Medium', 'High'];

export const STATUS_STYLES = {
  Todo: 'bg-slate-100 dark:bg-slate-700/40 text-slate-600 dark:text-slate-300',
  'In Progress': 'bg-amber-50 dark:bg-amber-500/15 text-amber-700 dark:text-amber-400',
  Done: 'bg-emerald-50 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-400',
};

export const PRIORITY_STYLES = {
  Low: 'bg-slate-100 dark:bg-slate-700/40 text-slate-600 dark:text-slate-300',
  Medium: 'bg-blue-50 dark:bg-blue-500/15 text-blue-700 dark:text-blue-400',
  High: 'bg-red-50 dark:bg-red-500/15 text-red-700 dark:text-red-400',
};
