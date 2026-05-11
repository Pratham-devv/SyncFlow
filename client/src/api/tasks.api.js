import api from './axios';

export const getTasks = (projectId, params = {}) =>
  api.get(`/tasks/${projectId}`, { params });

export const createTask = (data) => api.post('/tasks', data);

export const updateTask = (taskId, data) => api.put(`/tasks/${taskId}`, data);

export const deleteTask = (taskId) => api.delete(`/tasks/${taskId}`);

export const updateTaskStatus = (taskId, status) =>
  api.patch(`/tasks/${taskId}/status`, { status });
