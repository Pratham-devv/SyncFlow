import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import SortableTaskCard from './SortableTaskCard';

const DroppableColumn = ({ id, title, tasks, colorClass, borderClass, onEdit, onDelete, onStatusChange, onAddMember }) => {
  const { setNodeRef } = useDroppable({
    id,
  });

  return (
    <div className="flex flex-col w-[85vw] sm:w-[320px] xl:flex-1 shrink-0 snap-center bg-slate-100/50 dark:bg-dark-surface/50 rounded-2xl border border-slate-200 dark:border-dark-border p-4 h-[calc(100vh-200px)]">
      <div className={`flex items-center gap-2 mb-4 pb-3 border-b ${borderClass} shrink-0`}>
        <div className={`w-3 h-3 rounded-full ${colorClass}`} />
        <h3 className="font-bold text-slate-800 dark:text-white" style={{ fontFamily: 'var(--font-heading)' }}>{title}</h3>
        <span className="ml-auto bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border text-slate-500 dark:text-slate-400 text-xs font-bold px-2 py-0.5 rounded-md">
          {tasks.length}
        </span>
      </div>
      <SortableContext id={id} items={tasks.map(t => t._id)} strategy={verticalListSortingStrategy}>
        <div ref={setNodeRef} className="flex-1 overflow-y-auto space-y-3 pr-1 pb-4 min-h-[100px]">
          {tasks.map((task) => (
            <SortableTaskCard key={task._id} task={task} onDelete={onDelete} onStatusChange={onStatusChange} onEdit={onEdit} onAddMember={onAddMember} />
          ))}
          {tasks.length === 0 && (
            <div className="text-center py-8 text-slate-400 dark:text-slate-600 text-sm border-2 border-dashed border-slate-200 dark:border-dark-border rounded-xl">Drop here</div>
          )}
        </div>
      </SortableContext>
    </div>
  );
};

export default DroppableColumn;
