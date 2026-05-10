import asyncHandler from '../../utiles/asyncHandler.js';
import ApiResponse from '../../utiles/ApiResponse.js';
import ApiError from '../../utiles/ApiError.js';
import {
  createProject,
  getUserProjects,
  addMemberToProject,
} from './project.service.js';

export const create = asyncHandler(async (req, res) => {
  const { title, description } = req.body;

  if (!title) {
    throw new ApiError(400, 'Project title is required');
  }

  const project = await createProject({
    title,
    description,
    owner: req.user._id,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, project, 'Project created successfully'));
});

export const getAll = asyncHandler(async (req, res) => {
  const projects = await getUserProjects(req.user._id);

  return res
    .status(200)
    .json(new ApiResponse(200, projects, 'Projects fetched successfully'));
});

export const addMember = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    throw new ApiError(400, 'Member email is required');
  }

  const project = await addMemberToProject({
    projectId: req.params.id,
    email,
    requestingUserId: req.user._id,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, project, 'Member added successfully'));
});
