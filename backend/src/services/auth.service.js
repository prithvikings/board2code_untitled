import User from '../models/user.model.js';
import { ApiError } from '../utils/ApiError.js';

export const createUser = async (userData) => {
  if (await User.isEmailTaken(userData.email)) {
    throw new ApiError(400, 'Email already taken');
  }
  const user = await User.create(userData);
  return user;
};

export const loginUserWithEmailAndPassword = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user || !(await user.isPasswordMatch(password))) {
    throw new ApiError(401, 'Incorrect email or password');
  }
  return user;
};

export const getUserById = async (id) => {
  return User.findById(id);
};

export const updateUserById = async (userId, updateBody) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(404, 'User not found');
  }
  
  if (updateBody.email && (await User.isEmailTaken(updateBody.email, userId))) {
    throw new ApiError(400, 'Email already taken');
  }

  Object.assign(user, updateBody);
  await user.save();
  return user;
};

export const updateUserPassword = async (userId, currentPassword, newPassword) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  if (!(await user.isPasswordMatch(currentPassword))) {
    throw new ApiError(400, 'Incorrect current password');
  }

  user.password = newPassword;
  await user.save();
  return user;
};
