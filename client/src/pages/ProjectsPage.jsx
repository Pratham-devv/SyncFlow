import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { FolderOpen, Plus,  } from 'lucide-react';
import useProjects from '../hooks/useProjects';
import EmptyState from '../components/ui/EmptyState';
import CreateProjectModal from '../components/projects/CreateProjectModal';
import ProjectCard from '../components/projects/ProjectCard';


const ProjectsPage = () => {
  const { projects, loading, handleCreate } = useProjects();
  const [showCreate, setShowCreate] = useState(false);
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
              <ProjectCard 
                key={project._id}
                project={project}
                index={i}
                onClick={() => navigate(`/projects/${project._id}`)}
              />
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
    </div>
  );
};

export default ProjectsPage;
