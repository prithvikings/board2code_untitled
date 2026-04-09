import { verifyToken } from '../utils/jwt.js';
import * as authService from '../services/auth.service.js';
import { ApiError } from '../utils/ApiError.js';
import { catchAsync } from '../utils/catchAsync.js';

export const requireAuth = catchAsync(async (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    throw new ApiError(401, 'Please authenticate');
  }

  try {
    const decoded = verifyToken(token);
    const user = await authService.getUserById(decoded.sub);

    if (!user) {
      throw new ApiError(401, 'User not found');
    }

    req.user = user;
    next();
  } catch (error) {
    throw new ApiError(401, 'Invalid token');
  }
});
