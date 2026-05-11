import { useState } from 'react';
import Modal from '../ui/Modal';
import { addMemberSchema } from '../../validation/project.schema';

const AddMemberModal = ({ project, onClose, onAdd }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const result = addMemberSchema.safeParse({ email });
    if (!result.success) {
      setError(result.error.issues[0].message);
      return;
    }

    setLoading(true);
    try {
      await onAdd(project._id, result.data.email);
      setSuccess(`Member added to "${project.title}"`);
      setEmail('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={true}
      onClose={onClose}
      title={`Add Member — ${project.title}`}
      maxWidth="max-w-md"
    >
      <form onSubmit={handleSubmit} className="p-6 space-y-4">
        {error && (
          <div className="p-3 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-xl text-sm text-red-700 dark:text-red-400">
            {error}
          </div>
        )}
        {success && (
          <div className="p-3 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 rounded-xl text-sm text-emerald-700 dark:text-emerald-400">
            {success}
          </div>
        )}

        {/* Current members */}
        <div>
          <span className="text-xs font-bold uppercase text-slate-400 dark:text-slate-500 tracking-wider">
            Current Members
          </span>
          <div className="flex flex-wrap gap-2 mt-2">
            {project.members?.map((m) => (
              <span
                key={m._id}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 dark:bg-dark-hover rounded-full text-xs font-semibold text-slate-600 dark:text-slate-300"
              >
                <span className="w-5 h-5 rounded-full bg-brand-100 dark:bg-brand-500/20 text-brand-700 dark:text-brand-300 flex items-center justify-center text-[10px] font-bold">
                  {m.name?.charAt(0).toUpperCase()}
                </span>
                {m.name}
              </span>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Member Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => { setEmail(e.target.value); setError(''); }}
            placeholder="colleague@company.com"
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-dark-border bg-white dark:bg-dark-hover text-slate-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-brand-300 dark:focus:ring-brand-500/30 focus:border-brand-500 dark:focus:border-brand-500 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500"
          />
        </div>
        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 text-sm font-semibold text-slate-600 dark:text-slate-300 bg-white dark:bg-dark-hover border border-slate-200 dark:border-dark-border rounded-xl hover:bg-slate-50 dark:hover:bg-dark-border transition-colors cursor-pointer"
          >
            Done
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 text-sm font-bold text-white rounded-xl hover:opacity-90 active:scale-95 transition-all disabled:opacity-60 cursor-pointer"
            style={{ background: 'linear-gradient(135deg, #3730a3, #4f46e5)' }}
          >
            {loading ? 'Adding…' : 'Add Member'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default AddMemberModal;
