import { FolderOpen, ArrowRight } from 'lucide-react';
import AvatarGroup from '../ui/AvatarGroup';
import useTasks from '../../hooks/useTasks';
import { TASK_STATUS } from '../../constants';

const PROJECT_COLORS = [
  { bg: 'linear-gradient(135deg, #4f46e5, #6366f1)', clr: '#ffffff' },
  { bg: 'linear-gradient(135deg, #7c3aed, #8b5cf6)', clr: '#ffffff' },
  { bg: 'linear-gradient(135deg, #059669, #10b981)', clr: '#ffffff' },
  { bg: 'linear-gradient(135deg, #0891b2, #06b6d4)', clr: '#ffffff' },
  { bg: 'linear-gradient(135deg, #ea580c, #f97316)', clr: '#ffffff' },
  { bg: 'linear-gradient(135deg, #e11d48, #f43f5e)', clr: '#ffffff' },
];

const ProjectCard = ({ project, index = 0, onClick }) => {
  const color = PROJECT_COLORS[index % PROJECT_COLORS.length];
  const { tasks, loading } = useTasks(project._id);

  const total = tasks.length;
  const completed = tasks.filter((t) => t.status === TASK_STATUS.DONE).length;
  const progressPercent = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div
      onClick={onClick}
      className="rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl flex flex-col cursor-pointer group text-white relative overflow-hidden h-full"
      style={{ background: color.bg, boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}
    >
      <div className="absolute top-0 right-0 p-4 opacity-10 transform translate-x-4 -translate-y-4 group-hover:scale-110 transition-transform duration-500 pointer-events-none">
        <FolderOpen size={100} />
      </div>
      
      <div className="relative z-10 flex flex-col h-full">
        <h3
          className="font-bold text-xl mb-2 leading-snug"
          style={{ fontFamily: 'var(--font-heading)', letterSpacing: '-0.01em' }}
        >
          {project.title}
        </h3>
        <p className="text-sm text-white/80 leading-relaxed flex-1 mb-4 line-clamp-2">
          {project.description || 'No description'}
        </p>

        <div className="mb-6">
          <div className="flex items-end justify-between mb-1.5 text-sm">
            <span className="font-semibold text-white/90">Progress</span>
            <span className="font-bold">{loading ? '...' : `${progressPercent}%`}</span>
          </div>
          <div className="w-full bg-white/20 rounded-full h-1.5 overflow-hidden">
            <div 
              className="bg-white h-1.5 rounded-full transition-all duration-500" 
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-white/20 mt-auto">
          <AvatarGroup users={project.members || []} max={3} size={28} />
          <div className="flex items-center gap-1 text-xs font-semibold bg-white/20 px-2.5 py-1.5 rounded-lg backdrop-blur-sm group-hover:bg-white group-hover:text-slate-900 transition-colors">
            View Details <ArrowRight size={14} className="ml-0.5" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
