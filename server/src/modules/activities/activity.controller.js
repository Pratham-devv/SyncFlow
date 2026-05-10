import asyncHandler from '../../utiles/asyncHandler.js';
import ApiResponse from '../../utiles/ApiResponse.js';
import { getProjectActivities } from './activity.service.js';

export const getAll = asyncHandler(async (req, res) => {
  const result = await getProjectActivities({
    projectId: req.params.projectId,
    userId: req.user._id,
    query: req.query,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, result, 'Activities fetched successfully'));
});
