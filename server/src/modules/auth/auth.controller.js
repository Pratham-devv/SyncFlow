import asyncHandler from '../../utiles/asyncHandler.js';
import ApiResponse from '../../utiles/ApiResponse.js';
import ApiError from '../../utiles/ApiError.js';
import { createUser, authenticateUser } from './auth.service.js';

export const signup = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    throw new ApiError(400, 'All fields are required');
  }

  const user = await createUser({ name, email, password });

  return res
    .status(201)
    .json(new ApiResponse(201, user, 'User registered successfully'));
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const { user, accessToken } = await authenticateUser({ email, password });

  return res
    .status(200)
    .json(
      new ApiResponse(200, { user, accessToken }, 'Login successful')
    );
});

export const getMe = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(new ApiResponse(200, req.user, 'Current user fetched'));
});
