import User from '../../models/user.model.js';
import ApiError from '../../utiles/ApiError.js';

export const createUser = async ({ name, email, password }) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ApiError(409, 'User with this email already exists');
  }

  const user = await User.create({ name, email, password });

  // Return user without password
  const createdUser = await User.findById(user._id);
  return createdUser;
};

export const authenticateUser = async ({ email, password }) => {
  if (!email || !password) {
    throw new ApiError(400, 'Email and password are required');
  }

  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    throw new ApiError(401, 'Invalid email or password');
  }

  const isMatch = await user.isPasswordCorrect(password);
  if (!isMatch) {
    throw new ApiError(401, 'Invalid email or password');
  }

  const accessToken = user.generateAccessToken();

  // Strip password before returning
  const loggedInUser = await User.findById(user._id);

  return { user: loggedInUser, accessToken };
};
