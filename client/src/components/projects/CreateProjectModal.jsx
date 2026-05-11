import { useState } from 'react';
import Modal from '../ui/Modal';
import { createProjectSchema } from '../../validation/project.schema';

const CreateProjectModal = ({ open, onClose, onCreate }) => {
  const [form, setForm] = useState({ title: '', description: '' });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setApiError('');

    const result = createProjectSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors = {};
      result.error.issues.forEach((issue) => {
        fieldErrors[issue.path[0]] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setLoading(true);
    try {
      await onCreate(result.data);
      setForm({ title: '', description: '' });
      setErrors({});
      onClose();
    } catch (err) {
      setApiError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Create Project" maxWidth="max-w-lg">
      <form onSubmit={handleSubmit} className="p-6 space-y-4">
        {apiError && (
          <div className="p-3 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-xl text-sm text-red-700 dark:text-red-400">
            {apiError}
          </div>
        )}
        <div>
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Project Title *
          </label>
          <input
            value={form.title}
            onChange={(e) => {
              setForm((f) => ({ ...f, title: e.target.value }));
              setErrors((p) => ({ ...p, title: '' }));
            }}
            placeholder="Marketing Campaign Q3"
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-dark-border bg-white dark:bg-dark-hover text-slate-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-brand-300 dark:focus:ring-brand-500/30 focus:border-brand-500 dark:focus:border-brand-500 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500"
          />
          {errors.title && <p className="text-xs text-red-500 dark:text-red-400 mt-1">{errors.title}</p>}
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Description
          </label>
          <textarea
            value={form.description}
            onChange={(e) => {
              setForm((f) => ({ ...f, description: e.target.value }));
              setErrors((p) => ({ ...p, description: '' }));
            }}
            placeholder="Brief description of the project…"
            rows={3}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-dark-border bg-white dark:bg-dark-hover text-slate-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-brand-300 dark:focus:ring-brand-500/30 focus:border-brand-500 dark:focus:border-brand-500 transition-all resize-none placeholder:text-slate-400 dark:placeholder:text-slate-500"
          />
          {errors.description && <p className="text-xs text-red-500 dark:text-red-400 mt-1">{errors.description}</p>}
        </div>
        <div className="flex justify-end gap-3 pt-2">
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
            {loading ? 'Creating…' : 'Create Project'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default CreateProjectModal;
