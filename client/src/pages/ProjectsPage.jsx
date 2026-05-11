import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FolderOpen, Plus, Users, UserPlus, MoreHorizontal } from 'lucide-react';
import { getProjects, createProject, addMember } from '../api/projects.api';
import AvatarGroup from '../components/ui/AvatarGroup';
import Modal from '../components/ui/Modal';

const PROJECT_COLORS = [
  '#4f46e5', '#7c3aed', '#059669', '#0891b2', '#ea580c', '#e11d48',
];

const ProjectsPage = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [showAddMember, setShowAddMember] = useState(null);
  const navigate = useNavigate();

  const fetchProjects = async () => {
    try {
      const res = await getProjects();
      setProjects(res.data.data || []);
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="p-4 md:p-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2
              className="text-2xl md:text-3xl font-bold text-slate-900"
              style={{ fontFamily: 'var(--font-heading)', letterSpacing: '-0.02em' }}
            >
              Projects
            </h2>
            <p className="text-slate-500 mt-1 text-sm">
              Manage your team's projects and collaborators.
            </p>
          </div>
          <button
            onClick={() => setShowCreate(true)}
            className="flex items-center gap-1.5 px-4 py-2 text-sm font-bold text-white rounded-xl hover:opacity-90 active:scale-95 transition-all cursor-pointer"
            style={{
              background: 'linear-gradient(135deg, #3730a3, #4f46e5)',
              boxShadow: '0 4px 12px rgba(79,70,229,0.3)',
            }}
          >
            <Plus size={16} />
            New Project
          </button>
        </div>

        {loading ? (
          <div className="text-center py-20 text-slate-400">Loading…</div>
        ) : projects.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-4">
              <FolderOpen size={32} className="text-slate-300" />
            </div>
            <p className="text-slate-500 text-sm">No projects yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {projects.map((project, i) => (
              <div
                key={project._id}
                className="bg-white rounded-2xl border border-slate-200 p-5 flex flex-col hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 group"
                style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}
              >
                <div className="flex items-start justify-between mb-3">
                  <div
                    className="p-2.5 rounded-xl"
                    style={{ background: `${PROJECT_COLORS[i % 6]}12` }}
                  >
                    <FolderOpen
                      size={20}
                      style={{ color: PROJECT_COLORS[i % 6] }}
                    />
                  </div>
                  <button className="opacity-0 group-hover:opacity-100 p-1 rounded-lg text-slate-400 hover:bg-slate-100 transition-all">
                    <MoreHorizontal size={16} />
                  </button>
                </div>

                <h3
                  className="font-semibold text-slate-900 text-base mb-1"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  {project.title}
                </h3>
                <p className="text-sm text-slate-500 line-clamp-2 flex-1 mb-4">
                  {project.description || 'No description'}
                </p>

                {/* Members */}
                <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                  <AvatarGroup users={project.members || []} max={4} size={28} />
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setShowAddMember(project)}
                      className="p-1.5 rounded-lg text-slate-400 hover:bg-brand-50 hover:text-brand-600 transition-colors"
                      title="Add member"
                    >
                      <UserPlus size={16} />
                    </button>
                    <button
                      onClick={() =>
                        navigate(`/tasks?project=${project._id}`)
                      }
                      className="px-3 py-1.5 text-xs font-bold text-brand-600 bg-brand-50 rounded-lg hover:bg-brand-100 transition-colors cursor-pointer"
                    >
                      View Tasks
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create Project Modal */}
      <CreateProjectModal
        open={showCreate}
        onClose={() => setShowCreate(false)}
        onCreated={fetchProjects}
      />

      {/* Add Member Modal */}
      {showAddMember && (
        <AddMemberModal
          project={showAddMember}
          onClose={() => setShowAddMember(null)}
          onAdded={fetchProjects}
        />
      )}
    </div>
  );
};

// ── Create Project Modal ────────────────────────────────────────────
const CreateProjectModal = ({ open, onClose, onCreated }) => {
  const [form, setForm] = useState({ title: '', description: '' });
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
      await createProject(form);
      setForm({ title: '', description: '' });
      onCreated();
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Create Project" maxWidth="max-w-lg">
      <form onSubmit={handleSubmit} className="p-6 space-y-4">
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
            {error}
          </div>
        )}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">
            Project Title *
          </label>
          <input
            value={form.title}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            placeholder="Marketing Campaign Q3"
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm outline-none focus:ring-2 focus:ring-brand-300 focus:border-brand-500 transition-all"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">
            Description
          </label>
          <textarea
            value={form.description}
            onChange={(e) =>
              setForm((f) => ({ ...f, description: e.target.value }))
            }
            placeholder="Brief description of the project…"
            rows={3}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm outline-none focus:ring-2 focus:ring-brand-300 focus:border-brand-500 transition-all resize-none"
          />
        </div>
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
            {loading ? 'Creating…' : 'Create Project'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

// ── Add Member Modal ────────────────────────────────────────────
const AddMemberModal = ({ project, onClose, onAdded }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      setError('Email is required');
      return;
    }
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await addMember(project._id, { email });
      setSuccess(`Member added to "${project.title}"`);
      setEmail('');
      onAdded();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={true} onClose={onClose} title={`Add Member — ${project.title}`} maxWidth="max-w-md">
      <form onSubmit={handleSubmit} className="p-6 space-y-4">
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
            {error}
          </div>
        )}
        {success && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-sm text-emerald-700">
            {success}
          </div>
        )}

        {/* Current members */}
        <div>
          <span className="text-xs font-bold uppercase text-slate-400 tracking-wider">
            Current Members
          </span>
          <div className="flex flex-wrap gap-2 mt-2">
            {project.members?.map((m) => (
              <span
                key={m._id}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 rounded-full text-xs font-semibold text-slate-600"
              >
                <span className="w-5 h-5 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center text-[10px] font-bold">
                  {m.name?.charAt(0).toUpperCase()}
                </span>
                {m.name}
              </span>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">
            Member Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setError('');
            }}
            placeholder="colleague@company.com"
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm outline-none focus:ring-2 focus:ring-brand-300 focus:border-brand-500 transition-all"
          />
        </div>
        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 text-sm font-semibold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer"
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

export default ProjectsPage;
