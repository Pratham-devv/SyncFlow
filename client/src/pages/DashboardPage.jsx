import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FolderOpen,
 
  Users,
  Plus,
  Filter,
  MoreHorizontal,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getProjects, createProject } from '../api/projects.api';
import AvatarGroup from '../components/ui/AvatarGroup';
import Modal from '../components/ui/Modal';

const PROJECT_COLORS = [
  { clr: '#4f46e5', bg: 'rgba(79,70,229,0.08)' },
  { clr: '#7c3aed', bg: 'rgba(124,58,237,0.08)' },
  { clr: '#059669', bg: 'rgba(5,150,105,0.08)' },
  { clr: '#0891b2', bg: 'rgba(8,145,178,0.08)' },
  { clr: '#ea580c', bg: 'rgba(234,88,12,0.08)' },
  { clr: '#e11d48', bg: 'rgba(225,29,72,0.08)' },
];

const ProjectCard = ({ project, index }) => {
  const navigate = useNavigate();
  const color = PROJECT_COLORS[index % PROJECT_COLORS.length];

  return (
    <div
      onClick={() => navigate(`/tasks?project=${project._id}`)}
      className="bg-white rounded-2xl border border-slate-200 p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg flex flex-col cursor-pointer group"
      style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="p-2.5 rounded-xl" style={{ background: color.bg }}>
          <FolderOpen size={20} style={{ color: color.clr }} />
        </div>
        <button
          onClick={(e) => e.stopPropagation()}
          className="opacity-0 group-hover:opacity-100 p-1 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-all"
        >
          <MoreHorizontal size={16} />
        </button>
      </div>

      <h3
        className="font-semibold text-slate-900 text-base mb-2 leading-snug"
        style={{ fontFamily: 'var(--font-heading)' }}
      >
        {project.title}
      </h3>
      <p className="text-sm text-slate-500 leading-relaxed flex-1 mb-5 line-clamp-2">
        {project.description || 'No description'}
      </p>

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-slate-100">
        <AvatarGroup users={project.members || []} max={3} size={26} />
        <div className="flex items-center gap-1 text-xs text-slate-400">
          <Users size={13} />
          {project.members?.length || 0} members
        </div>
      </div>
    </div>
  );
};

const DashboardPage = ({ onNewProject }) => {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

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

  const stats = [
    {
      label: 'Active Projects',
      val: projects.length,
      icon: FolderOpen,
      bg: '#eef2ff',
      clr: '#4f46e5',
    },
    {
      label: 'Total Members',
      val: new Set(projects.flatMap((p) => p.members?.map((m) => m._id) || [])).size,
      icon: Users,
      bg: '#faf5ff',
      clr: '#7c3aed',
    },
  ];

  // Greeting based on time of day
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="p-4 md:p-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h2
              className="text-2xl md:text-3xl font-bold text-slate-900"
              style={{
                fontFamily: 'var(--font-heading)',
                letterSpacing: '-0.02em',
              }}
            >
              {greeting}, {user?.name?.split(' ')[0]} 👋
            </h2>
            <p className="text-slate-500 mt-1 text-sm">
              You have {projects.length} project
              {projects.length !== 1 ? 's' : ''} in your workspace.
            </p>
          </div>
          <div className="flex gap-2">
            <button className="flex items-center gap-1.5 px-3 py-2 text-sm font-semibold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer">
              <Filter size={16} />
              Filter
            </button>
            <button
              onClick={onNewProject}
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
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map(({ label, val, icon: Icon, bg, clr }) => (
            <div
              key={label}
              className="bg-white rounded-2xl border border-slate-200 p-4 flex items-center gap-4 hover:shadow-md transition-shadow duration-200"
            >
              <div className="p-2.5 rounded-xl shrink-0" style={{ background: bg }}>
                <Icon size={20} style={{ color: clr }} />
              </div>
              <div className="min-w-0">
                <div className="text-xs text-slate-500 font-medium truncate">
                  {label}
                </div>
                <div
                  className="text-lg font-bold text-slate-900 leading-tight"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  {val}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Projects grid */}
        <div className="flex items-center justify-between mb-4">
          <h3
            className="font-bold text-slate-800 text-base"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Your Projects
          </h3>
        </div>

        {loading ? (
          <div className="text-center py-20 text-slate-400">Loading…</div>
        ) : projects.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-4">
              <FolderOpen size={32} className="text-slate-300" />
            </div>
            <p className="text-slate-500 text-sm mb-4">
              No projects yet. Create your first project to get started!
            </p>
            <button
              onClick={onNewProject}
              className="px-4 py-2 text-sm font-bold text-white rounded-xl cursor-pointer"
              style={{
                background: 'linear-gradient(135deg, #3730a3, #4f46e5)',
              }}
            >
              Create Project
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-5 pb-8">
            {projects.map((p, i) => (
              <ProjectCard key={p._id} project={p} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
