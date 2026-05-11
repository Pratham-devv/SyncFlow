import api from './axios';

export const getActivities = (projectId, params = {}) =>
  api.get(`/activities/${projectId}`, { params });
