import { useState } from 'react';
import { FolderOpen, Users, Plus, Filter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import useProjects from '../hooks/useProjects';
import ProjectCard from '../components/projects/ProjectCard';
import CreateProjectModal from '../components/projects/CreateProjectModal';
import StatCard from '../components/ui/StatCard';
import EmptyState from '../components/ui/EmptyState';

const DashboardPage = () => {
  const { user } = useAuth();
  const { projects, loading, stats, handleCreate } = useProjects();
  const navigate = useNavigate();
  const [showCreate, setShowCreate] = useState(false);

  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  const STATS_CONFIG = [
    { label: 'Active Projects', value: stats.totalProjects, icon: FolderOpen, bgColor: '#eef2ff', iconColor: '#4f46e5' },
    { label: 'Total Members', value: stats.totalMembers, icon: Users, bgColor: '#faf5ff', iconColor: '#7c3aed' },
  ];

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="p-4 md:p-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h2
              className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white"
              style={{ fontFamily: 'var(--font-heading)', letterSpacing: '-0.02em' }}
            >
              {greeting}, {user?.name?.split(' ')[0]} 👋
            </h2>
            <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm">
              You have {projects.length} project{projects.length !== 1 ? 's' : ''} in your workspace.
            </p>
          </div>
          <div className="flex gap-2">
            <button className="flex items-center gap-1.5 px-3 py-2 text-sm font-semibold text-slate-600 dark:text-slate-300 bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border rounded-xl hover:bg-slate-50 dark:hover:bg-dark-hover transition-colors cursor-pointer">
              <Filter size={16} /> Filter
            </button>
            <button
              onClick={() => setShowCreate(true)}
              className="flex items-center gap-1.5 px-4 py-2 text-sm font-bold text-white rounded-xl hover:opacity-90 active:scale-95 transition-all cursor-pointer"
              style={{ background: 'linear-gradient(135deg, #3730a3, #4f46e5)', boxShadow: '0 4px 12px rgba(79,70,229,0.3)' }}
            >
              <Plus size={16} /> New Project
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {STATS_CONFIG.map((s) => (
            <StatCard key={s.label} {...s} />
          ))}
        </div>

        {/* Projects grid */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-slate-800 dark:text-slate-200 text-base" style={{ fontFamily: 'var(--font-heading)' }}>
            Your Projects
          </h3>
        </div>

        {loading ? (
          <div className="text-center py-20 text-slate-400 dark:text-slate-500">Loading…</div>
        ) : projects.length === 0 ? (
          <EmptyState
            icon={FolderOpen}
            title="No projects yet"
            description="Create your first project to get started!"
            action={
              <button
                onClick={() => setShowCreate(true)}
                className="px-4 py-2 text-sm font-bold text-white rounded-xl cursor-pointer"
                style={{ background: 'linear-gradient(135deg, #3730a3, #4f46e5)' }}
              >
                Create Project
              </button>
            }
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-5 pb-8">
            {projects.map((p, i) => (
              <ProjectCard
                key={p._id}
                project={p}
                index={i}
                onClick={() => navigate(`/projects/${p._id}`)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Create project modal — owned by this page */}
      <CreateProjectModal
        open={showCreate}
        onClose={() => setShowCreate(false)}
        onCreate={handleCreate}
      />
    </div>
  );
};

export default DashboardPage;
