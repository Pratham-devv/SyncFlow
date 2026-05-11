import { useState, useEffect, useCallback } from 'react';
import {
  getTasks,
  createTask,
  deleteTask,
  updateTaskStatus,
} from '../api/tasks.api';

const useTasks = (projectId) => {
  const [tasks, setTasks] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({ status: '', page: 1, limit: 50 });

  const fetchTasks = useCallback(async () => {
    if (!projectId) {
      setTasks([]);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const params = { limit: filters.limit, page: filters.page };
      if (filters.status) params.status = filters.status;
      const res = await getTasks(projectId, params);
      setTasks(res.data.data?.data || []);
      setPagination(res.data.data?.pagination || {});
    } catch (err) {
      setError(err.message);
      setTasks([]);
    } finally {
      setLoading(false);
    }
  }, [projectId, filters]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleCreate = async (data) => {
    const res = await createTask({ ...data, projectId });
    await fetchTasks();
    return res.data.data;
  };

  const handleDelete = async (taskId) => {
    await deleteTask(taskId);
    await fetchTasks();
  };

  const handleStatusChange = async (taskId, status) => {
    await updateTaskStatus(taskId, status);
    await fetchTasks();
  };

  const setStatusFilter = (status) => {
    setFilters((prev) => ({ ...prev, status, page: 1 }));
  };

  return {
    tasks,
    pagination,
    loading,
    error,
    filters,
    setStatusFilter,
    fetchTasks,
    handleCreate,
    handleDelete,
    handleStatusChange,
  };
};

export default useTasks;
