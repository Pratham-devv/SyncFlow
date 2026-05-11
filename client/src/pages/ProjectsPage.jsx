import { useState, useEffect, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { FolderOpen, Plus, Search } from 'lucide-react';
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

  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('recent');

  const filteredAndSortedProjects = useMemo(() => {
    let result = [...projects];

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(p => 
        p.title?.toLowerCase().includes(q) || 
        p.description?.toLowerCase().includes(q)
      );
    }

    result.sort((a, b) => {
      if (sortBy === 'recent') {
        return new Date(b.updatedAt || b.createdAt || 0).getTime() - new Date(a.updatedAt || a.createdAt || 0).getTime();
      } else if (sortBy === 'name') {
        return (a.title || '').localeCompare(b.title || '');
      } else if (sortBy === 'teamSize') {
        return (b.members?.length || 0) - (a.members?.length || 0);
      }
      return 0;
    });

    return result;
  }, [projects, searchQuery, sortBy]);

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="p-4 md:p-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2
              className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white"
              style={{ fontFamily: 'var(--font-heading)', letterSpacing: '-0.02em' }}
            >
              Projects
            </h2>
            <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm">
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

        {/* Controls */}
        <div className="flex flex-col sm:flex-row items-center gap-4 mb-8">
          <div className="relative w-full sm:max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-slate-400 dark:text-slate-500" />
            </div>
            <input
              type="text"
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2.5 w-full text-sm font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border rounded-xl outline-none focus:ring-2 focus:ring-brand-300 dark:focus:ring-brand-500/30 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto sm:ml-auto">
            <span className="text-sm font-medium text-slate-500 dark:text-slate-400 whitespace-nowrap">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2.5 w-full sm:w-auto text-sm font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border rounded-xl outline-none focus:ring-2 focus:ring-brand-300 dark:focus:ring-brand-500/30 cursor-pointer"
            >
              <option value="recent">Recent</option>
              <option value="name">Name (A-Z)</option>
              <option value="teamSize">Team Size</option>
            </select>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="text-center py-20 text-slate-400 dark:text-slate-500">Loading…</div>
        ) : filteredAndSortedProjects.length === 0 ? (
          <EmptyState
            icon={FolderOpen}
            title={projects.length === 0 ? "No projects yet" : "No projects found"}
            description={projects.length === 0 ? "Create your first project to get started." : "Try adjusting your search criteria."}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {filteredAndSortedProjects.map((project, i) => (
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
