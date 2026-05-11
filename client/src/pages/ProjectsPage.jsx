import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { FolderOpen, Plus, UserPlus, MoreHorizontal } from 'lucide-react';
import useProjects from '../hooks/useProjects';
import AvatarGroup from '../components/ui/AvatarGroup';
import EmptyState from '../components/ui/EmptyState';
import CreateProjectModal from '../components/projects/CreateProjectModal';
import AddMemberModal from '../components/projects/AddMemberModal';

const PROJECT_COLORS = [
  '#4f46e5', '#7c3aed', '#059669', '#0891b2', '#ea580c', '#e11d48',
];

const ProjectsPage = () => {
  const { projects, loading, handleCreate, handleAddMember } = useProjects();
  const [showCreate, setShowCreate] = useState(false);
  const [memberTarget, setMemberTarget] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // Auto-open modal when navigated with ?create=true (e.g. from Sidebar)
  useEffect(() => {
    if (searchParams.get('create') === 'true') {
      setShowCreate(true);
      searchParams.delete('create');
      setSearchParams(searchParams, { replace: true });
    }
  }, [searchParams, setSearchParams]);

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
            style={{ background: 'linear-gradient(135deg, #3730a3, #4f46e5)', boxShadow: '0 4px 12px rgba(79,70,229,0.3)' }}
          >
            <Plus size={16} /> New Project
          </button>
        </div>

        {/* Content */}
        {loading ? (
          <div className="text-center py-20 text-slate-400">Loading…</div>
        ) : projects.length === 0 ? (
          <EmptyState
            icon={FolderOpen}
            title="No projects yet"
            description="Create your first project to get started."
          />
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
                    <FolderOpen size={20} style={{ color: PROJECT_COLORS[i % 6] }} />
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

                <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                  <AvatarGroup users={project.members || []} max={4} size={28} />
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setMemberTarget(project)}
                      className="p-1.5 rounded-lg text-slate-400 hover:bg-brand-50 hover:text-brand-600 transition-colors cursor-pointer"
                      title="Add member"
                    >
                      <UserPlus size={16} />
                    </button>
                    <button
                      onClick={() => navigate(`/tasks?project=${project._id}`)}
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

      {/* Modals */}
      <CreateProjectModal
        open={showCreate}
        onClose={() => setShowCreate(false)}
        onCreate={handleCreate}
      />
      {memberTarget && (
        <AddMemberModal
          project={memberTarget}
          onClose={() => setMemberTarget(null)}
          onAdd={handleAddMember}
        />
      )}
    </div>
  );
};

export default ProjectsPage;
