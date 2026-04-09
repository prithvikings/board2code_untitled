import express from 'express';
import { z } from 'zod';
import { validate } from '../middlewares/validate.middleware.js';
import { requireAuth } from '../middlewares/auth.middleware.js';
import * as authController from '../controllers/auth.controller.js';

const router = express.Router();

// Validation Schemas
const registerSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters long'),
});

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

const updateProfileSchema = z.object({
  name: z.string().min(1, 'Name is required').optional(),
  email: z.string().email('Invalid email address').optional(),
  avatarSeed: z.string().optional(),
}).refine(data => data.name !== undefined || data.email !== undefined || data.avatarSeed !== undefined, {
  message: 'At least one field (name, email, or avatarSeed) must be provided'
});

const updatePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(8, 'New password must be at least 8 characters long'),
});

// Routes
router.post('/register', validate(registerSchema), authController.register);
router.post('/login', validate(loginSchema), authController.login);
router.post('/logout', authController.logout);

// Protected Routes
router.get('/me', requireAuth, authController.getMe);
router.patch('/me/profile', requireAuth, validate(updateProfileSchema), authController.updateProfile);
router.patch('/me/password', requireAuth, validate(updatePasswordSchema), authController.updatePassword);

export default router;
