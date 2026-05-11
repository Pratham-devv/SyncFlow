import { useState, useEffect, useCallback } from 'react';
import { getProjects, createProject, addMember } from '../api/projects.api';

const useProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProjects = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getProjects();
      setProjects(res.data.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const handleCreate = async (data) => {
    const res = await createProject(data);
    await fetchProjects();
    return res.data.data;
  };

  const handleAddMember = async (projectId, email) => {
    const res = await addMember(projectId, { email });
    await fetchProjects();
    return res.data.data;
  };

  // Derived stats
  const stats = {
    totalProjects: projects.length,
    totalMembers: new Set(
      projects.flatMap((p) => p.members?.map((m) => m._id) || [])
    ).size,
  };

  return {
    projects,
    loading,
    error,
    stats,
    fetchProjects,
    handleCreate,
    handleAddMember,
  };
};

export default useProjects;
