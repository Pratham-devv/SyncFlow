import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Plus, CheckCircle2, Activity, Search, ArrowUp, ArrowDown } from 'lucide-react';
import useProjects from '../hooks/useProjects';
import useTasks from '../hooks/useTasks';
import useActivities from '../hooks/useActivities';
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import TaskCard from '../components/tasks/TaskCard';
import DroppableColumn from '../components/tasks/DroppableColumn';
import CreateTaskModal from '../components/tasks/CreateTaskModal';
import UpdateTaskModal from '../components/tasks/UpdateTaskModal';
import AssignTaskMemberModal from '../components/tasks/AssignTaskMemberModal';
import ActivityFeed from '../components/activities/ActivityFeed';
import EmptyState from '../components/ui/EmptyState';
import Pagination from '../components/ui/Pagination';
import { TASK_STATUS } from '../constants';

const TasksPage = () => {
  const [searchParams] = useSearchParams();
  const projectIdParam = searchParams.get('project');

  const { projects } = useProjects();
  const [selectedProjectId, setSelectedProjectId] = useState(projectIdParam || '');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [taskToUpdate, setTaskToUpdate] = useState(null);
  const [taskToAssign, setTaskToAssign] = useState(null);
  const [showMobileActivity, setShowMobileActivity] = useState(false);
  const [boardTasks, setBoardTasks] = useState([]);
  const [activeTask, setActiveTask] = useState(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');

  // Auto-select first project when list loads and nothing is selected
  useEffect(() => {
    if (!selectedProjectId && projects.length > 0) {
      setSelectedProjectId(projects[0]._id);
    }
  }, [projects, selectedProjectId]);

  // Update selection when URL param changes
  useEffect(() => {
    if (projectIdParam) setSelectedProjectId(projectIdParam);
  }, [projectIdParam]);

  const {
    tasks,
    pagination,
    loading,
    filters,
    setStatusFilter,
    setPage,
    handleCreate,
    handleDelete,
    handleStatusChange,
    handleUpdate,
  } = useTasks(selectedProjectId);

  const { activities, loading: activitiesLoading, refetch: refetchActivities } = useActivities(selectedProjectId);

  const currentProject = projects.find((p) => p._id === selectedProjectId);

  // Wrap mutations to also refresh activities
  const onDelete = async (taskId) => {
    if (!confirm('Delete this task?')) return;
    await handleDelete(taskId);
    refetchActivities();
  };

  const onStatusChange = async (taskId, status) => {
    await handleStatusChange(taskId, status);
    refetchActivities();
  };

  const onCreate = async (data) => {
    await handleCreate(data);
    refetchActivities();
  };

  const onUpdateTask = async (taskId, data) => {
    await handleUpdate(taskId, data);
    refetchActivities();
  };

  const onAssignTask = async (taskId, assignedTo) => {
    await handleUpdate(taskId, { assignedTo });
    refetchActivities();
  };

  useEffect(() => {
    setBoardTasks(tasks);
  }, [tasks]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor)
  );

  const handleDragStart = (event) => {
    const { active } = event;
    const task = boardTasks.find((t) => t._id === active.id);
    if (task) setActiveTask(task);
  };

  const handleDragOver = (event) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;
    if (activeId === overId) return;

    const isActiveTask = active.data.current?.type === 'Task';
    const isOverTask = over.data.current?.type === 'Task';

    if (!isActiveTask) return;

    const activeTaskObj = boardTasks.find(t => t._id === activeId);
    if (!activeTaskObj) return;

    let overContainer = null;
    if (isOverTask) {
      const overTaskObj = boardTasks.find(t => t._id === overId);
      overContainer = overTaskObj?.status;
    } else {
      overContainer = overId;
    }

    if (!overContainer || activeTaskObj.status === overContainer) return;

    setBoardTasks((prev) => {
      const newBoard = [...prev];
      const activeIndex = prev.findIndex(t => t._id === activeId);
      newBoard[activeIndex] = { ...newBoard[activeIndex], status: overContainer };
      return newBoard;
    });
  };

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    setActiveTask(null);

    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    const activeTaskObj = boardTasks.find(t => t._id === activeId);
    if (!activeTaskObj) return;

    // eslint-disable-next-line no-useless-assignment
    let overContainer = null;
    const isOverTask = over.data.current?.type === 'Task';
    if (isOverTask) {
      const overTaskObj = boardTasks.find(t => t._id === overId);
      overContainer = overTaskObj?.status;
    } else {
      overContainer = overId;
    }

    const originalTask = tasks.find(t => t._id === activeId);
    if (originalTask && originalTask.status !== overContainer) {
      await onStatusChange(activeId, overContainer);
    }
  };

  const filteredAndSortedTasks = useMemo(() => {
    let result = [...boardTasks];

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(t => 
        t.title?.toLowerCase().includes(q) || 
        t.description?.toLowerCase().includes(q) ||
        t.assignedTo?.name?.toLowerCase().includes(q)
      );
    }

    result.sort((a, b) => {
      let comparison = 0;
      if (sortBy === 'date') {
        comparison = new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime();
      } else if (sortBy === 'importance') {
        const priorityScore = { HIGH: 3, MEDIUM: 2, LOW: 1 };
        comparison = (priorityScore[a.priority] || 0) - (priorityScore[b.priority] || 0);
      } else if (sortBy === 'user') {
        const nameA = a.assignedTo?.name || 'zzzz';
        const nameB = b.assignedTo?.name || 'zzzz';
        comparison = nameA.localeCompare(nameB);
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return result;
  }, [boardTasks, searchQuery, sortBy, sortOrder]);

  const todoTasks = filteredAndSortedTasks.filter(t => t.status === TASK_STATUS.TODO);
  const inProgressTasks = filteredAndSortedTasks.filter(t => t.status === TASK_STATUS.IN_PROGRESS);
  const doneTasks = filteredAndSortedTasks.filter(t => t.status === TASK_STATUS.DONE);

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="flex-1 flex overflow-hidden">
        {/* Task list */}
        <div className="flex-1 flex flex-col p-4 md:p-6 overflow-y-auto min-w-0">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h2
                className="text-2xl font-bold text-slate-900 dark:text-white"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                Tasks
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                {tasks.length} task{tasks.length !== 1 ? 's' : ''}
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              {/* Search Bar */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search size={16} className="text-slate-400 dark:text-slate-500" />
                </div>
                <input
                  type="text"
                  placeholder="Search tasks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 pr-3 py-2 w-full sm:w-48 lg:w-64 text-sm font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border rounded-xl outline-none focus:ring-2 focus:ring-brand-300 dark:focus:ring-brand-500/30 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500"
                />
              </div>

              <div className="flex gap-2 flex-wrap">
                {/* Project selector */}
              <select
                value={selectedProjectId}
                onChange={(e) => setSelectedProjectId(e.target.value)}
                className="px-3 py-2 text-sm font-semibold text-slate-600 dark:text-slate-200 bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border rounded-xl outline-none focus:ring-2 focus:ring-brand-300 dark:focus:ring-brand-500/30"
              >
                <option value="">Select Project</option>
                {projects.map((p) => (
                  <option key={p._id} value={p._id}>{p.title}</option>
                ))}
              </select>

              {/* Status filter */}
              <select
                value={filters.status}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 text-sm font-semibold text-slate-600 dark:text-slate-200 bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border rounded-xl outline-none focus:ring-2 focus:ring-brand-300 dark:focus:ring-brand-500/30"
              >
                <option value="">All Status</option>
                {Object.values(TASK_STATUS).map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>

              {/* Sort By filter */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 text-sm font-semibold text-slate-600 dark:text-slate-200 bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border rounded-xl outline-none focus:ring-2 focus:ring-brand-300 dark:focus:ring-brand-500/30"
              >
                <option value="date">Sort by Date</option>
                <option value="importance">Sort by Importance</option>
                <option value="user">Sort by User</option>
              </select>

              {/* Sort Order Toggle */}
              <button
                onClick={() => setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc')}
                className="flex items-center justify-center px-3 py-2 text-slate-600 dark:text-slate-300 bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border rounded-xl outline-none hover:bg-slate-50 dark:hover:bg-dark-hover active:scale-95 transition-all cursor-pointer"
                title={`Sort ${sortOrder === 'desc' ? 'Descending' : 'Ascending'}`}
              >
                {sortOrder === 'desc' ? <ArrowDown size={16} /> : <ArrowUp size={16} />}
              </button>

              <button
                onClick={() => setShowCreateModal(true)}
                disabled={!selectedProjectId}
                className="flex items-center gap-1.5 px-4 py-2 text-sm font-bold text-white rounded-xl hover:opacity-90 active:scale-95 transition-all disabled:opacity-40 cursor-pointer"
                style={{ background: 'linear-gradient(135deg, #3730a3, #4f46e5)' }}
              >
                <Plus size={16} /> New Task
              </button>
              
              <button
                onClick={() => setShowMobileActivity(true)}
                className="flex lg:hidden items-center justify-center p-2 text-slate-500 dark:text-slate-400 bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border rounded-xl hover:bg-slate-50 dark:hover:bg-dark-hover active:scale-95 transition-all cursor-pointer"
                title="View Activity"
              >
                <Activity size={18} />
              </button>
            </div>
            </div>
          </div>

          {/* Body */}
          {!selectedProjectId ? (
            <EmptyState
              icon={CheckCircle2}
              title="Select a project"
              description="Choose a project from the dropdown to view its tasks."
            />
          ) : loading ? (
            <div className="text-center py-20 text-slate-400 dark:text-slate-500">Loading…</div>
          ) : tasks.length === 0 ? (
            <EmptyState
              icon={CheckCircle2}
              title="No tasks yet"
              description="Create your first task!"
              action={
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="px-4 py-2 text-sm font-bold text-white rounded-xl cursor-pointer"
                  style={{ background: 'linear-gradient(135deg, #3730a3, #4f46e5)' }}
                >
                  Create Task
                </button>
              }
            />
          ) : (
            <DndContext 
              sensors={sensors} 
              collisionDetection={closestCorners} 
              onDragStart={handleDragStart}
              onDragOver={handleDragOver}
              onDragEnd={handleDragEnd}
            >
              <div className="flex flex-row gap-4 md:gap-6 pb-6 h-full overflow-x-auto items-start snap-x snap-mandatory">
                <DroppableColumn 
                  id={TASK_STATUS.TODO} 
                  title="To Do" 
                  tasks={todoTasks} 
                  colorClass="bg-slate-400" 
                  borderClass="border-slate-200 dark:border-dark-border"
                  onEdit={(t) => setTaskToUpdate(t)}
                  onDelete={onDelete}
                  onStatusChange={onStatusChange}
                  onAddMember={(t) => setTaskToAssign(t)}
                />
                <DroppableColumn 
                  id={TASK_STATUS.IN_PROGRESS} 
                  title="In Progress" 
                  tasks={inProgressTasks} 
                  colorClass="bg-brand-500" 
                  borderClass="border-brand-200 dark:border-brand-500/30"
                  onEdit={(t) => setTaskToUpdate(t)}
                  onDelete={onDelete}
                  onStatusChange={onStatusChange}
                  onAddMember={(t) => setTaskToAssign(t)}
                />
                <DroppableColumn 
                  id={TASK_STATUS.DONE} 
                  title="Done" 
                  tasks={doneTasks} 
                  colorClass="bg-emerald-500" 
                  borderClass="border-emerald-200 dark:border-emerald-500/30"
                  onEdit={(t) => setTaskToUpdate(t)}
                  onDelete={onDelete}
                  onStatusChange={onStatusChange}
                  onAddMember={(t) => setTaskToAssign(t)}
                />
              </div>
              <DragOverlay>
                {activeTask ? <TaskCard task={activeTask} /> : null}
              </DragOverlay>
            </DndContext>
          )}

          {/* Pagination controls */}
          <Pagination pagination={pagination} onPageChange={setPage} />
        </div>

        {/* Activity sidebar */}
        <ActivityFeed 
          activities={activities} 
          loading={activitiesLoading} 
          mobileOpen={showMobileActivity} 
          onCloseMobile={() => setShowMobileActivity(false)} 
        />
      </div>

      {/* Create task modal */}
      <CreateTaskModal
        open={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreate={onCreate}
        members={currentProject?.members || []}
      />

      {/* Update task modal */}
      <UpdateTaskModal
        open={!!taskToUpdate}
        onClose={() => setTaskToUpdate(null)}
        onUpdate={onUpdateTask}
        task={taskToUpdate}
      />

      {/* Assign member modal */}
      <AssignTaskMemberModal
        open={!!taskToAssign}
        onClose={() => setTaskToAssign(null)}
        onAssign={onAssignTask}
        task={taskToAssign}
        members={currentProject?.members || []}
      />
    </div>
  );
};

export default TasksPage;
