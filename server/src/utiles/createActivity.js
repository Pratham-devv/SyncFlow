import Activity from '../models/activity.model.js';

/**
 * Logs an activity entry for the project timeline.
 * Fire-and-forget — errors are logged but never block the main flow.
 */
const createActivity = async ({ user, project, task = null, action, message }) => {
  try {
    await Activity.create({ user, project, task, action, message });
  } catch (error) {
    console.error('Failed to log activity:', error.message);
  }
};

export default createActivity;
