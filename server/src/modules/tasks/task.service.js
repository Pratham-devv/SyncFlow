import Task from '../../models/task.model.js';
import Project from '../../models/project.model.js';
import ApiError from '../../utiles/ApiError.js';
import paginate from '../../utiles/paginate.js';
import createActivity from '../../utiles/createActivity.js';
import { ACTIVITY_ACTIONS, TASK_STATUS } from '../../constants/index.js';

/**
 * Verifies the user is a member of the project. Throws 403 otherwise.
 */
const assertProjectMember = async (projectId, userId) => {
  const project = await Project.findById(projectId);
  if (!project) throw new ApiError(404, 'Project not found');

  const isMember = project.members.some(
    (m) => m.toString() === userId.toString()
  );
  if (!isMember) throw new ApiError(403, 'You are not a member of this project');

  return project;
};

export const createTask = async ({ title, description, priority, dueDate, assignedTo, projectId, createdBy }) => {
  await assertProjectMember(projectId, createdBy);

  const task = await Task.create({
    title,
    description,
    priority,
    dueDate,
    assignedTo,
    project: projectId,
    createdBy,
  });

  await createActivity({
    user: createdBy,
    project: projectId,
    task: task._id,
    action: ACTIVITY_ACTIONS.TASK_CREATED,
    message: `Task "${task.title}" was created`,
  });

  return task.populate([
    { path: 'assignedTo', select: 'name email' },
    { path: 'createdBy', select: 'name email' },
  ]);
};

export const getProjectTasks = async ({ projectId, userId, query }) => {
  await assertProjectMember(projectId, userId);

  const filter = { project: projectId };

  // Optional filters
  if (query.status && Object.values(TASK_STATUS).includes(query.status)) {
    filter.status = query.status;
  }
  if (query.priority) {
    filter.priority = query.priority;
  }
  if (query.assignedTo) {
    filter.assignedTo = query.assignedTo;
  }

  const baseQuery = Task.find(filter)
    .populate('assignedTo', 'name email')
    .populate('createdBy', 'name email')
    .sort({ createdAt: -1 });

  return paginate(baseQuery, {
    page: query.page,
    limit: query.limit,
  });
};

export const updateTask = async ({ taskId, updates, userId }) => {
  const task = await Task.findById(taskId);
  if (!task) throw new ApiError(404, 'Task not found');

  await assertProjectMember(task.project, userId);

  const allowedFields = ['title', 'description', 'priority', 'dueDate', 'assignedTo'];
  const changes = [];

  for (const field of allowedFields) {
    if (updates[field] !== undefined && updates[field] !== task[field]?.toString()) {
      if (field === 'assignedTo') {
        changes.push('assignment');
      }
      task[field] = updates[field];
    }
  }

  await task.save();

  // Log assignment change specifically, otherwise generic update
  if (changes.includes('assignment')) {
    await createActivity({
      user: userId,
      project: task.project,
      task: task._id,
      action: ACTIVITY_ACTIONS.ASSIGNMENT_CHANGED,
      message: `Task "${task.title}" was reassigned`,
    });
  } else {
    await createActivity({
      user: userId,
      project: task.project,
      task: task._id,
      action: ACTIVITY_ACTIONS.TASK_UPDATED,
      message: `Task "${task.title}" was updated`,
    });
  }

  return task.populate([
    { path: 'assignedTo', select: 'name email' },
    { path: 'createdBy', select: 'name email' },
  ]);
};

export const deleteTask = async ({ taskId, userId }) => {
  const task = await Task.findById(taskId);
  if (!task) throw new ApiError(404, 'Task not found');

  await assertProjectMember(task.project, userId);

  const taskTitle = task.title;
  const projectId = task.project;

  await task.deleteOne();

  await createActivity({
    user: userId,
    project: projectId,
    task: taskId,
    action: ACTIVITY_ACTIONS.TASK_DELETED,
    message: `Task "${taskTitle}" was deleted`,
  });
};

export const updateTaskStatus = async ({ taskId, status, userId }) => {
  if (!Object.values(TASK_STATUS).includes(status)) {
    throw new ApiError(400, `Invalid status. Allowed: ${Object.values(TASK_STATUS).join(', ')}`);
  }

  const task = await Task.findById(taskId);
  if (!task) throw new ApiError(404, 'Task not found');

  await assertProjectMember(task.project, userId);

  const oldStatus = task.status;
  task.status = status;
  await task.save();

  await createActivity({
    user: userId,
    project: task.project,
    task: task._id,
    action: ACTIVITY_ACTIONS.STATUS_CHANGED,
    message: `Task "${task.title}" status changed from "${oldStatus}" to "${status}"`,
  });

  return task.populate([
    { path: 'assignedTo', select: 'name email' },
    { path: 'createdBy', select: 'name email' },
  ]);
};
