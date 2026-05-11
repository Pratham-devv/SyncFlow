import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Plus,
  Filter,
  Clock,
  MessageSquare,
  MoreHorizontal,
  Trash2,
  X,
  CheckCircle2,
  Circle,
  Timer,
  ChevronDown,
} from 'lucide-react';
import { getTasks, createTask, updateTask, deleteTask, updateTaskStatus } from '../api/tasks.api';
import { getActivities } from '../api/activities.api';
import { getProjects } from '../api/projects.api';
import Badge from '../components/ui/Badge';
import AvatarGroup from '../components/ui/AvatarGroup';
import Modal from '../components/ui/Modal';
import { STATUS_STYLES, PRIORITY_STYLES, TASK_STATUS, PRIORITY_OPTIONS } from '../constants';

// ── Activity Feed Sidebar ────────────────────────────────────────
const ActivityFeed = ({ projectId }) => {
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    if (!projectId) return;
    getActivities(projectId, { limit: 20 })
      .then((res) => setActivities(res.data.data?.data || []))
      .catch(() => {});
  }, [projectId]);

  if (!projectId) return null;

  const ACTION_ICONS = {
    PROJECT_CREATED: { icon: CheckCircle2, bg: 'rgba(5,150,105,0.1)', clr: '#059669' },
    MEMBER_ADDED: { icon: Plus, bg: 'rgba(79,70,229,0.1)', clr: '#4f46e5' },
    TASK_CREATED: { icon: Plus, bg: 'rgba(5,150,105,0.1)', clr: '#059669' },
    TASK_UPDATED: { icon: Timer, bg: 'rgba(234,88,12,0.1)', clr: '#ea580c' },
    TASK_DELETED: { icon: Trash2, bg: 'rgba(225,29,72,0.1)', clr: '#e11d48' },
    STATUS_CHANGED: { icon: CheckCircle2, bg: 'rgba(79,70,229,0.1)', clr: '#4f46e5' },
    ASSIGNMENT_CHANGED: { icon: Plus, bg: 'rgba(124,58,237,0.1)', clr: '#7c3aed' },
  };

  return (
    <aside className="hidden lg:flex flex-col w-72 xl:w-80 bg-white border-l border-slate-200 overflow-hidden shrink-0">
      <div className="px-5 py-4 border-b border-slate-200">
        <h3
          className="font-bold text-slate-900"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          Activity
        </h3>
      </div>
      <div className="flex-1 overflow-y-auto p-5 space-y-5">
        {activities.length === 0 && (
          <p className="text-sm text-slate-400 text-center py-8">No activity yet</p>
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
                <p className="text-sm text-slate-700 leading-snug">
                  <span className="font-bold text-slate-900">
                    {item.user?.name || 'Someone'}
                  </span>{' '}
                  <span className="text-slate-500">{item.message}</span>
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  {new Date(item.createdAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </aside>
  );
};

// ── Task Card ─────────────────────────────────────────────────────
const TaskCard = ({ task, selected, onClick, onDelete, onStatusChange }) => (
  <div
    onClick={onClick}
    className={`bg-white rounded-2xl border p-5 cursor-pointer transition-all duration-200 flex flex-col gap-3 group ${
      selected
        ? 'border-brand-400 ring-1 ring-brand-400'
        : 'border-slate-200 hover:border-slate-300'
    }`}
    style={{
      boxShadow: selected
        ? '0 4px 20px rgba(79,70,229,0.12)'
        : '0 1px 3px rgba(0,0,0,0.04)',
    }}
  >
    <div className="flex items-start justify-between">
      <div className="flex items-center gap-2">
        <Badge className={PRIORITY_STYLES[task.priority] || 'bg-slate-100 text-slate-600'}>
          {task.priority}
        </Badge>
        <Badge className={STATUS_STYLES[task.status] || 'bg-slate-100 text-slate-600'}>
          {task.status}
        </Badge>
      </div>
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(task._id);
          }}
          className="p-1 rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-500 transition-all"
        >
          <Trash2 size={14} />
        </button>
        <button
          onClick={(e) => e.stopPropagation()}
          className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-all"
        >
          <MoreHorizontal size={14} />
        </button>
      </div>
    </div>

    <div>
      <h3
        className="font-semibold text-slate-900 text-[15px] leading-snug mb-1.5"
        style={{ fontFamily: 'var(--font-heading)' }}
      >
        {task.title}
      </h3>
      {task.description && (
        <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed">
          {task.description}
        </p>
      )}
    </div>

    <div className="flex items-center justify-between pt-2 border-t border-slate-100">
      <div className="flex items-center gap-2">
        {task.assignedTo && (
          <AvatarGroup users={[task.assignedTo]} max={1} size={26} />
        )}
      </div>
      <div className="flex items-center gap-3 text-xs text-slate-400">
        {task.dueDate && (
          <span className="flex items-center gap-1">
            <Clock size={13} />
            {new Date(task.dueDate).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
            })}
          </span>
        )}
      </div>
    </div>

    {/* Quick status buttons */}
    <div className="flex gap-1 pt-1">
      {Object.values(TASK_STATUS).map((s) => (
        <button
          key={s}
          onClick={(e) => {
            e.stopPropagation();
            if (task.status !== s) onStatusChange(task._id, s);
          }}
          className={`px-2 py-0.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
            task.status === s
              ? 'bg-brand-600 text-white'
              : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
          }`}
        >
          {s}
        </button>
      ))}
    </div>
  </div>
);

// ── Create Task Modal ──────────────────────────────────────────────
const CreateTaskModal = ({ open, onClose, projectId, members, onCreated }) => {
  const [form, setForm] = useState({
    title: '',
    description: '',
    priority: 'Medium',
    dueDate: '',
    assignedTo: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) {
      setError('Title is required');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await createTask({
        ...form,
        projectId,
        assignedTo: form.assignedTo || undefined,
        dueDate: form.dueDate || undefined,
      });
      setForm({ title: '', description: '', priority: 'Medium', dueDate: '', assignedTo: '' });
      onCreated();
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Create Task">
      <form onSubmit={handleSubmit} className="p-6 space-y-4">
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
            {error}
          </div>
        )}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">
            Title *
          </label>
          <input
            value={form.title}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            placeholder="Task title"
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm outline-none focus:ring-2 focus:ring-brand-300 focus:border-brand-500 transition-all"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">
            Description
          </label>
          <textarea
            value={form.description}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            placeholder="What needs to be done?"
            rows={3}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm outline-none focus:ring-2 focus:ring-brand-300 focus:border-brand-500 transition-all resize-none"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              Priority
            </label>
            <select
              value={form.priority}
              onChange={(e) => setForm((f) => ({ ...f, priority: e.target.value }))}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm outline-none focus:ring-2 focus:ring-brand-300 focus:border-brand-500 transition-all"
            >
              {PRIORITY_OPTIONS.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              Due Date
            </label>
            <input
              type="date"
              value={form.dueDate}
              onChange={(e) => setForm((f) => ({ ...f, dueDate: e.target.value }))}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm outline-none focus:ring-2 focus:ring-brand-300 focus:border-brand-500 transition-all"
            />
          </div>
        </div>
        {members?.length > 0 && (
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              Assign To
            </label>
            <select
              value={form.assignedTo}
              onChange={(e) => setForm((f) => ({ ...f, assignedTo: e.target.value }))}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm outline-none focus:ring-2 focus:ring-brand-300 focus:border-brand-500 transition-all"
            >
              <option value="">Unassigned</option>
              {members.map((m) => (
                <option key={m._id} value={m._id}>{m.name}</option>
              ))}
            </select>
          </div>
        )}
        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 text-sm font-semibold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 text-sm font-bold text-white rounded-xl hover:opacity-90 active:scale-95 transition-all disabled:opacity-60 cursor-pointer"
            style={{ background: 'linear-gradient(135deg, #3730a3, #4f46e5)' }}
          >
            {loading ? 'Creating…' : 'Create Task'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

// ── Tasks Page ──────────────────────────────────────────────────────
const TasksPage = () => {
  const [searchParams] = useSearchParams();
  const projectIdParam = searchParams.get('project');

  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState(projectIdParam || '');
  const [tasks, setTasks] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [activityKey, setActivityKey] = useState(0);

  // Fetch projects list for the dropdown
  useEffect(() => {
    getProjects()
      .then((res) => {
        const p = res.data.data || [];
        setProjects(p);
        if (!selectedProjectId && p.length > 0) {
          setSelectedProjectId(p[0]._id);
        }
      })
      .catch(() => {});
  }, []);

  // Fetch tasks when project or filter changes
  const fetchTasks = useCallback(async () => {
    if (!selectedProjectId) return;
    setLoading(true);
    try {
      const params = { limit: 50 };
      if (statusFilter) params.status = statusFilter;
      const res = await getTasks(selectedProjectId, params);
      setTasks(res.data.data?.data || []);
      setPagination(res.data.data?.pagination || {});
    } catch {
      setTasks([]);
    } finally {
      setLoading(false);
    }
  }, [selectedProjectId, statusFilter]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleDelete = async (taskId) => {
    if (!confirm('Delete this task?')) return;
    try {
      await deleteTask(taskId);
      fetchTasks();
      setActivityKey((k) => k + 1);
    } catch {
      // silent
    }
  };

  const handleStatusChange = async (taskId, status) => {
    try {
      await updateTaskStatus(taskId, status);
      fetchTasks();
      setActivityKey((k) => k + 1);
    } catch {
      // silent
    }
  };

  const currentProject = projects.find((p) => p._id === selectedProjectId);

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="flex-1 flex overflow-hidden">
        {/* Task list */}
        <div className="flex-1 flex flex-col p-4 md:p-6 overflow-y-auto min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h2
                className="text-2xl font-bold text-slate-900"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                Tasks
              </h2>
              <p className="text-sm text-slate-500 mt-0.5">
                {tasks.length} task{tasks.length !== 1 ? 's' : ''}{' '}
                {statusFilter && `(filtered: ${statusFilter})`}
              </p>
            </div>
            <div className="flex gap-2 flex-wrap">
              {/* Project selector */}
              <select
                value={selectedProjectId}
                onChange={(e) => setSelectedProjectId(e.target.value)}
                className="px-3 py-2 text-sm font-semibold text-slate-600 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-brand-300"
              >
                <option value="">Select Project</option>
                {projects.map((p) => (
                  <option key={p._id} value={p._id}>{p.title}</option>
                ))}
              </select>

              {/* Status filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 text-sm font-semibold text-slate-600 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-brand-300"
              >
                <option value="">All Status</option>
                {Object.values(TASK_STATUS).map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>

              <button
                onClick={() => setShowCreateModal(true)}
                disabled={!selectedProjectId}
                className="flex items-center gap-1.5 px-4 py-2 text-sm font-bold text-white rounded-xl hover:opacity-90 active:scale-95 transition-all disabled:opacity-40 cursor-pointer"
                style={{
                  background: 'linear-gradient(135deg, #3730a3, #4f46e5)',
                }}
              >
                <Plus size={16} />
                New Task
              </button>
            </div>
          </div>

          {!selectedProjectId ? (
            <div className="text-center py-20 text-slate-400 text-sm">
              Select a project to view tasks.
            </div>
          ) : loading ? (
            <div className="text-center py-20 text-slate-400">Loading…</div>
          ) : tasks.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 size={32} className="text-slate-300" />
              </div>
              <p className="text-slate-500 text-sm mb-4">
                No tasks yet. Create your first task!
              </p>
              <button
                onClick={() => setShowCreateModal(true)}
                className="px-4 py-2 text-sm font-bold text-white rounded-xl cursor-pointer"
                style={{
                  background: 'linear-gradient(135deg, #3730a3, #4f46e5)',
                }}
              >
                Create Task
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-3 pb-6">
              {tasks.map((task) => (
                <TaskCard
                  key={task._id}
                  task={task}
                  onDelete={handleDelete}
                  onStatusChange={handleStatusChange}
                />
              ))}
            </div>
          )}
        </div>

        {/* Activity feed */}
        <ActivityFeed key={activityKey} projectId={selectedProjectId} />
      </div>

      {/* Create task modal */}
      <CreateTaskModal
        open={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        projectId={selectedProjectId}
        members={currentProject?.members || []}
        onCreated={() => {
          fetchTasks();
          setActivityKey((k) => k + 1);
        }}
      />
    </div>
  );
};

export default TasksPage;
