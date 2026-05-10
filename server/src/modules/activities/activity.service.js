import Activity from '../../models/activity.model.js';
import Project from '../../models/project.model.js';
import ApiError from '../../utiles/ApiError.js';
import paginate from '../../utiles/paginate.js';

export const getProjectActivities = async ({ projectId, userId, query }) => {
  const project = await Project.findById(projectId);
  if (!project) throw new ApiError(404, 'Project not found');

  const isMember = project.members.some(
    (m) => m.toString() === userId.toString()
  );
  if (!isMember) throw new ApiError(403, 'You are not a member of this project');

  const baseQuery = Activity.find({ project: projectId })
    .populate('user', 'name email')
    .populate('task', 'title')
    .sort({ createdAt: -1 });

  return paginate(baseQuery, {
    page: query.page,
    limit: query.limit,
  });
};
