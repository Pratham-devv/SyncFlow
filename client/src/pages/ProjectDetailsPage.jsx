import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Users, CheckCircle, Clock, Circle, LayoutList, ChevronRight, Activity } from 'lucide-react';
import useProjects from '../hooks/useProjects';
import useTasks from '../hooks/useTasks';
import useActivities from '../hooks/useActivities';
import AvatarGroup from '../components/ui/AvatarGroup';
import ActivityFeed from '../components/activities/ActivityFeed';
import AddMemberModal from '../components/projects/AddMemberModal';
import { TASK_STATUS } from '../constants';

const ProjectDetailsPage = () => {
  const [showAddMember, setShowAddMember] = useState(false);
  const [showMobileActivity, setShowMobileActivity] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();
  const { projects, loading: projectsLoading, handleAddMember } = useProjects();
  const { tasks, loading: tasksLoading } = useTasks(id);
  const { activities, loading: activitiesLoading } = useActivities(id);

  const project = projects.find((p) => p._id === id);

  if (projectsLoading) {
    return <div className="text-center py-20 text-slate-400 dark:text-slate-500">Loading project…</div>;
  }

  if (!project) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8">
        <h3 className="text-xl font-bold text-slate-700 dark:text-slate-300 mb-2">Project not found</h3>
        <button
          onClick={() => navigate('/projects')}
          className="text-brand-600 dark:text-brand-400 hover:underline"
        >
          Back to Projects
        </button>
      </div>
    );
  }

  // Calculate task statistics
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === TASK_STATUS.DONE).length;
  const inProgressTasks = tasks.filter((t) => t.status === TASK_STATUS.IN_PROGRESS).length;
  const notStartedTasks = tasks.filter((t) => t.status === TASK_STATUS.TODO).length;
  
  const completionPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div className="flex-1 flex overflow-hidden bg-slate-50 dark:bg-dark-bg">
      
      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-4 md:p-8">
        <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Navigation & Header */}
        <div>
          <button
            onClick={() => navigate('/projects')}
            className="flex items-center gap-2 text-sm font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors mb-6 cursor-pointer"
          >
            <ArrowLeft size={16} /> Back to Projects
          </button>
          
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
            <div>
              <h1
                className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-2"
                style={{ fontFamily: 'var(--font-heading)', letterSpacing: '-0.02em' }}
              >
                {project.title}
              </h1>
              <p className="text-slate-600 dark:text-slate-400 max-w-2xl text-lg leading-relaxed">
                {project.description || 'No description provided for this project.'}
              </p>
            </div>
            <div className="flex gap-2">
              <Link
                to={`/tasks?project=${project._id}`}
                className="flex items-center gap-2 px-5 py-2.5 bg-brand-600 text-white font-bold rounded-xl hover:bg-brand-700 transition-colors shadow-sm shrink-0"
              >
                <LayoutList size={18} />
                Open Task Board
              </Link>
              
              <button
                onClick={() => setShowMobileActivity(true)}
                className="flex lg:hidden items-center justify-center p-2.5 text-slate-500 dark:text-slate-400 bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border rounded-xl hover:bg-slate-50 dark:hover:bg-dark-hover active:scale-95 transition-all cursor-pointer"
                title="View Activity"
              >
                <Activity size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-dark-card rounded-2xl p-5 border border-slate-200 dark:border-dark-border flex flex-col gap-2">
            <div className="text-slate-500 dark:text-slate-400 text-sm font-semibold flex items-center gap-2">
              <LayoutList size={16} /> Total Tasks
            </div>
            <div className="text-3xl font-bold text-slate-900 dark:text-white">{tasksLoading ? '...' : totalTasks}</div>
          </div>
          <div className="bg-white dark:bg-dark-card rounded-2xl p-5 border border-slate-200 dark:border-dark-border flex flex-col gap-2">
            <div className="text-green-600 dark:text-green-400 text-sm font-semibold flex items-center gap-2">
              <CheckCircle size={16} /> Completed
            </div>
            <div className="text-3xl font-bold text-green-700 dark:text-green-400">{tasksLoading ? '...' : completedTasks}</div>
          </div>
          <div className="bg-white dark:bg-dark-card rounded-2xl p-5 border border-slate-200 dark:border-dark-border flex flex-col gap-2">
            <div className="text-blue-600 dark:text-blue-400 text-sm font-semibold flex items-center gap-2">
              <Clock size={16} /> In Progress
            </div>
            <div className="text-3xl font-bold text-blue-700 dark:text-blue-400">{tasksLoading ? '...' : inProgressTasks}</div>
          </div>
          <div className="bg-white dark:bg-dark-card rounded-2xl p-5 border border-slate-200 dark:border-dark-border flex flex-col gap-2">
            <div className="text-slate-400 dark:text-slate-500 text-sm font-semibold flex items-center gap-2">
              <Circle size={16} /> Not Started
            </div>
            <div className="text-3xl font-bold text-slate-700 dark:text-slate-300">{tasksLoading ? '...' : notStartedTasks}</div>
          </div>
        </div>

        {/* Details Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Progress Overview */}
          <div className="bg-white dark:bg-dark-card rounded-2xl p-6 border border-slate-200 dark:border-dark-border shadow-sm dark:shadow-black/10">
            <h3 className="font-bold text-slate-900 dark:text-white mb-4 text-lg">Overall Progress</h3>
            <div className="flex items-end justify-between mb-2">
              <span className="text-3xl font-bold text-brand-600 dark:text-brand-400">{completionPercentage}%</span>
              <span className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-1">completed</span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-dark-hover rounded-full h-3 overflow-hidden">
              <div 
                className="bg-brand-500 h-3 rounded-full transition-all duration-500" 
                style={{ width: `${completionPercentage}%` }}
              ></div>
            </div>
          </div>

          {/* People Overview */}
          <div className="bg-white dark:bg-dark-card rounded-2xl p-6 border border-slate-200 dark:border-dark-border shadow-sm dark:shadow-black/10 flex flex-col gap-6">
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white mb-3 text-lg">Project Creator / Owner</h3>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-brand-100 dark:bg-brand-500/20 text-brand-700 dark:text-brand-300 flex items-center justify-center font-bold text-lg">
                  {project.owner?.name?.charAt(0) || '?'}
                </div>
                <div>
                  <p className="font-semibold text-slate-900 dark:text-white">{project.owner?.name || 'Unknown'}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{project.owner?.email || 'No email'}</p>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="font-bold text-sm uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-3">Team Members ({project.members?.length || 0})</h3>
              <div className="flex items-center justify-between">
                <AvatarGroup users={project.members || []} max={6} size={36} />
                <button
                  onClick={() => setShowAddMember(true)}
                  className="px-3 py-1.5 text-xs font-bold text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-500/10 rounded-lg hover:bg-brand-100 dark:hover:bg-brand-500/20 transition-colors cursor-pointer flex items-center gap-1"
                >
                  <Users size={14} /> Add Member
                </button>
              </div>
            </div>
          </div>
        </div>

        </div>
      </div>

      {/* Activity sidebar */}
      <ActivityFeed 
        activities={activities} 
        loading={activitiesLoading} 
        mobileOpen={showMobileActivity}
        onCloseMobile={() => setShowMobileActivity(false)}
      />
      
      {showAddMember && (
        <AddMemberModal
          project={project}
          onClose={() => setShowAddMember(false)}
          onAdd={handleAddMember}
        />
      )}
    </div>
  );
};

export default ProjectDetailsPage;
