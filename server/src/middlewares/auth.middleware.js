import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';
import ApiError from '../utiles/ApiError.js';
import asyncHandler from '../utiles/asyncHandler.js';

export const verifyJWT = asyncHandler(async (req, _res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    throw new ApiError(401, 'Unauthorized — no token provided');
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const user = await User.findById(decoded._id);

    if (!user) {
      throw new ApiError(401, 'Unauthorized — invalid token');
    }

    req.user = user;
    next();
  } catch (error) {
    throw new ApiError(401, error.message || 'Invalid access token');
  }
});
