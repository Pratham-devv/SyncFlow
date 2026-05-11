import { FolderOpen, MoreHorizontal, Users } from 'lucide-react';
import AvatarGroup from '../ui/AvatarGroup';

const PROJECT_COLORS = [
  { clr: '#4f46e5', bg: 'rgba(79,70,229,0.08)' },
  { clr: '#7c3aed', bg: 'rgba(124,58,237,0.08)' },
  { clr: '#059669', bg: 'rgba(5,150,105,0.08)' },
  { clr: '#0891b2', bg: 'rgba(8,145,178,0.08)' },
  { clr: '#ea580c', bg: 'rgba(234,88,12,0.08)' },
  { clr: '#e11d48', bg: 'rgba(225,29,72,0.08)' },
];

const ProjectCard = ({ project, index = 0, onClick }) => {
  const color = PROJECT_COLORS[index % PROJECT_COLORS.length];

  return (
    <div
      onClick={onClick}
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

export default ProjectCard;
