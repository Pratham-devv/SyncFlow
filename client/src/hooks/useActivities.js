import { useState, useEffect, useCallback } from 'react';
import { getActivities } from '../api/activities.api';

const useActivities = (projectId) => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchActivities = useCallback(async () => {
    if (!projectId) {
      setActivities([]);
      return;
    }
    setLoading(true);
    try {
      const res = await getActivities(projectId, { limit: 20 });
      setActivities(res.data.data?.data || []);
    } catch {
      setActivities([]);
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchActivities();
  }, [fetchActivities]);

  return { activities, loading, refetch: fetchActivities };
};

export default useActivities;
