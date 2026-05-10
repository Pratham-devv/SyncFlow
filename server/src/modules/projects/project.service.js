import Project from '../../models/project.model.js';
import User from '../../models/user.model.js';
import ApiError from '../../utiles/ApiError.js';
import createActivity from '../../utiles/createActivity.js';
import { ACTIVITY_ACTIONS } from '../../constants/index.js';

export const createProject = async ({ title, description, owner }) => {
  const project = await Project.create({ title, description, owner });

  await createActivity({
    user: owner,
    project: project._id,
    action: ACTIVITY_ACTIONS.PROJECT_CREATED,
    message: `Project "${project.title}" was created`,
  });

  return project.populate('owner members', 'name email');
};

export const getUserProjects = async (userId) => {
  const projects = await Project.find({ members: userId })
    .populate('owner', 'name email')
    .populate('members', 'name email')
    .sort({ updatedAt: -1 });

  return projects;
};

export const addMemberToProject = async ({ projectId, email, requestingUserId }) => {
  const project = await Project.findById(projectId);
  if (!project) {
    throw new ApiError(404, 'Project not found');
  }

  // Only owner can add members
  if (project.owner.toString() !== requestingUserId.toString()) {
    throw new ApiError(403, 'Only the project owner can add members');
  }

  const userToAdd = await User.findOne({ email });
  if (!userToAdd) {
    throw new ApiError(404, 'User with this email does not exist');
  }

  if (project.members.includes(userToAdd._id)) {
    throw new ApiError(409, 'User is already a member of this project');
  }

  project.members.push(userToAdd._id);
  await project.save();

  await createActivity({
    user: requestingUserId,
    project: project._id,
    action: ACTIVITY_ACTIONS.MEMBER_ADDED,
    message: `${userToAdd.name} was added to the project`,
  });

  return project.populate('owner members', 'name email');
};
