import { useState, useRef, useEffect } from 'react';
import { Clock, Trash2, MoreHorizontal, Edit, UserPlus, CheckCircle } from 'lucide-react';
import Badge from '../ui/Badge';
import AvatarGroup from '../ui/AvatarGroup';
import { STATUS_STYLES, PRIORITY_STYLES, TASK_STATUS } from '../../constants';

const TaskCard = ({ task, onDelete, onStatusChange, onEdit, onAddMember }) => {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
  <div
    className="bg-white rounded-2xl border border-slate-200 p-5 transition-all duration-200 hover:border-slate-300 flex flex-col gap-3 group"
    style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}
  >
    {/* Header */}
    <div className="flex items-start justify-between">
      <div className="flex items-center gap-2 flex-wrap">
        <Badge className={PRIORITY_STYLES[task.priority] || 'bg-slate-100 text-slate-600'}>
          {task.priority}
        </Badge>
        <Badge className={STATUS_STYLES[task.status] || 'bg-slate-100 text-slate-600'}>
          {task.status}
        </Badge>
      </div>
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all">
        <button
          onClick={() => onDelete(task._id)}
          className="p-1 rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-500 transition-all cursor-pointer"
        >
          <Trash2 size={14} />
        </button>
        <div className="relative" ref={menuRef}>
          <button 
            onClick={() => setShowMenu(!showMenu)}
            className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-all cursor-pointer"
          >
            <MoreHorizontal size={14} />
          </button>
          
          {showMenu && (
            <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-slate-200 rounded-xl shadow-lg z-10 py-1 overflow-hidden" style={{ zIndex: 50 }}>
              <button 
                onClick={() => { setShowMenu(false); onEdit(task); }}
                className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2 cursor-pointer transition-colors"
              >
                <Edit size={14} />
                Update Task
              </button>
              <button 
                onClick={() => { setShowMenu(false); onAddMember(task); }}
                className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2 cursor-pointer transition-colors"
              >
                <UserPlus size={14} />
                Add Member
              </button>
              
              <div className="border-t border-slate-100 my-1"></div>
              <div className="px-4 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Change Progress</div>
              {Object.values(TASK_STATUS).map((s) => (
                <button
                  key={s}
                  onClick={() => { 
                    if (task.status !== s) onStatusChange(task._id, s);
                    setShowMenu(false);
                  }}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-slate-50 flex items-center gap-2 cursor-pointer transition-colors ${
                    task.status === s ? 'text-brand-600 font-medium' : 'text-slate-600'
                  }`}
                >
                  <CheckCircle size={14} className={task.status === s ? 'opacity-100' : 'opacity-0 w-3.5'} />
                  {s}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>

    {/* Body */}
    <div>
      <h3
        className="font-semibold text-slate-900 text-[15px] leading-snug mb-1.5"
        style={{ fontFamily: 'var(--font-heading)' }}
      >
        {task.title}
      </h3>
      {task.description && (
        <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed">
          {task.description}
        </p>
      )}
    </div>

    {/* Meta row */}
    <div className="flex items-center justify-between pt-2 border-t border-slate-100">
      {task.assignedTo ? (
        <AvatarGroup users={[task.assignedTo]} max={1} size={26} />
      ) : (
        <span className="text-xs text-slate-300">Unassigned</span>
      )}
      {task.dueDate && (
        <span className="flex items-center gap-1 text-xs text-slate-400">
          <Clock size={13} />
          {new Date(task.dueDate).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
          })}
        </span>
      )}
    </div>

    </div>
  );
};

export default TaskCard;
