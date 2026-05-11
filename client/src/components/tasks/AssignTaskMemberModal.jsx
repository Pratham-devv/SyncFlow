import { useState, useEffect } from 'react';
import Modal from '../ui/Modal';

const AssignTaskMemberModal = ({ open, onClose, onAssign, task, members = [] }) => {
  const [assignedTo, setAssignedTo] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (task) {
      setAssignedTo(task.assignedTo?._id || task.assignedTo || '');
    }
  }, [task]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await onAssign(task._id, assignedTo || null);
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!task) return null;

  return (
    <Modal open={open} onClose={onClose} title="Assign Task" maxWidth="max-w-md">
      <form onSubmit={handleSubmit} className="p-6 space-y-4">
        {error && (
          <div className="p-3 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-xl text-sm text-red-700 dark:text-red-400">
            {error}
          </div>
        )}
        <div>
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Assign To</label>
          <select
            value={assignedTo}
            onChange={(e) => setAssignedTo(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-dark-border bg-white dark:bg-dark-hover text-slate-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-brand-300 dark:focus:ring-brand-500/30 focus:border-brand-500 dark:focus:border-brand-500 transition-all"
          >
            <option value="">Unassigned</option>
            {members.map((m) => (
              <option key={m._id} value={m._id}>{m.name}</option>
            ))}
          </select>
          <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
            Select a member from the existing project members.
          </p>
        </div>
        <div className="flex justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 text-sm font-semibold text-slate-600 dark:text-slate-300 bg-white dark:bg-dark-hover border border-slate-200 dark:border-dark-border rounded-xl hover:bg-slate-50 dark:hover:bg-dark-border transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 text-sm font-bold text-white rounded-xl hover:opacity-90 active:scale-95 transition-all disabled:opacity-60 cursor-pointer"
            style={{ background: 'linear-gradient(135deg, #3730a3, #4f46e5)' }}
          >
            {loading ? 'Assigning…' : 'Assign Member'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default AssignTaskMemberModal;
