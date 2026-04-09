import * as authService from '../services/auth.service.js';
import { generateToken } from '../utils/jwt.js';
import { catchAsync } from '../utils/catchAsync.js';

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

export const register = catchAsync(async (req, res) => {
  const user = await authService.createUser(req.body);
  const token = generateToken(user._id);
  
  res.cookie('token', token, cookieOptions);
  res.status(201).json({ user });
});

export const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const user = await authService.loginUserWithEmailAndPassword(email, password);
  const token = generateToken(user._id);

  res.cookie('token', token, cookieOptions);
  res.json({ user });
});

export const logout = catchAsync(async (req, res) => {
  res.cookie('token', '', { ...cookieOptions, maxAge: 0 });
  res.json({ message: 'Logged out successfully' });
});

export const getMe = catchAsync(async (req, res) => {
  // req.user is set by the auth middleware
  const user = req.user;
  res.json({ user });
});

export const updateProfile = catchAsync(async (req, res) => {
  const user = await authService.updateUserById(req.user._id, req.body);
  res.json({ user });
});

export const updatePassword = catchAsync(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const user = await authService.updateUserPassword(req.user._id, currentPassword, newPassword);
  res.json({ message: 'Password updated successfully' });
});
