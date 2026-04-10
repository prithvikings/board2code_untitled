import { z } from 'zod';
import { ApiError } from '../utils/ApiError.js';

export const validate = (schema) => (req, res, next) => {
  try {
    // We only validate the body usually, but can be extended to query/params
    schema.parse(req.body);
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessage = error.issues.map((e) => e.message).join(', ');
      next(new ApiError(400, errorMessage));
    } else {
      next(error);
    }
  }
};
