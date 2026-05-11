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
  Todo: 'bg-slate-100 text-slate-600',
  'In Progress': 'bg-amber-50 text-amber-700',
  Done: 'bg-emerald-50 text-emerald-700',
};

export const PRIORITY_STYLES = {
  Low: 'bg-slate-100 text-slate-600',
  Medium: 'bg-blue-50 text-blue-700',
  High: 'bg-red-50 text-red-700',
};
