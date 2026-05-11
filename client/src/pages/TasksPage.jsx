import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Plus, CheckCircle2, Activity } from 'lucide-react';
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

  const todoTasks = boardTasks.filter(t => t.status === TASK_STATUS.TODO);
  const inProgressTasks = boardTasks.filter(t => t.status === TASK_STATUS.IN_PROGRESS);
  const doneTasks = boardTasks.filter(t => t.status === TASK_STATUS.DONE);

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="flex-1 flex overflow-hidden">
        {/* Task list */}
        <div className="flex-1 flex flex-col p-4 md:p-6 overflow-y-auto min-w-0">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h2
                className="text-2xl font-bold text-slate-900"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                Tasks
              </h2>
              <p className="text-sm text-slate-500 mt-0.5">
                {tasks.length} task{tasks.length !== 1 ? 's' : ''}
                {filters.status ? ` · ${filters.status}` : ''}
              </p>
            </div>
            <div className="flex gap-2 flex-wrap">
              {/* Project selector */}
              <select
                value={selectedProjectId}
                onChange={(e) => setSelectedProjectId(e.target.value)}
                className="px-3 py-2 text-sm font-semibold text-slate-600 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-brand-300"
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
                className="px-3 py-2 text-sm font-semibold text-slate-600 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-brand-300"
              >
                <option value="">All Status</option>
                {Object.values(TASK_STATUS).map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>

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
                className="flex lg:hidden items-center justify-center p-2 text-slate-500 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 active:scale-95 transition-all cursor-pointer"
                title="View Activity"
              >
                <Activity size={18} />
              </button>
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
            <div className="text-center py-20 text-slate-400">Loading…</div>
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
                  borderClass="border-slate-200"
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
                  borderClass="border-brand-200"
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
                  borderClass="border-emerald-200"
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
