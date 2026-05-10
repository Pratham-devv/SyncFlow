import asyncHandler from '../../utiles/asyncHandler.js';
import ApiResponse from '../../utiles/ApiResponse.js';
import ApiError from '../../utiles/ApiError.js';
import {
  createTask,
  getProjectTasks,
  updateTask,
  deleteTask,
  updateTaskStatus,
} from './task.service.js';

export const create = asyncHandler(async (req, res) => {
  const { title, description, priority, dueDate, assignedTo, projectId } = req.body;

  if (!title || !projectId) {
    throw new ApiError(400, 'Task title and projectId are required');
  }

  const task = await createTask({
    title,
    description,
    priority,
    dueDate,
    assignedTo,
    projectId,
    createdBy: req.user._id,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, task, 'Task created successfully'));
});

export const getAll = asyncHandler(async (req, res) => {
  const { projectId } = req.params;

  const result = await getProjectTasks({
    projectId,
    userId: req.user._id,
    query: req.query,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, result, 'Tasks fetched successfully'));
});

export const update = asyncHandler(async (req, res) => {
  const task = await updateTask({
    taskId: req.params.id,
    updates: req.body,
    userId: req.user._id,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, task, 'Task updated successfully'));
});

export const remove = asyncHandler(async (req, res) => {
  await deleteTask({
    taskId: req.params.id,
    userId: req.user._id,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, null, 'Task deleted successfully'));
});

export const changeStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;

  if (!status) {
    throw new ApiError(400, 'Status is required');
  }

  const task = await updateTaskStatus({
    taskId: req.params.id,
    status,
    userId: req.user._id,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, task, 'Task status updated successfully'));
});
