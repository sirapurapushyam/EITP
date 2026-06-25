import { z } from 'zod';
import { CAMPUSES, YEAR_OF_STUDY } from '../constants/campus.constants.js';

export const registerStudentSchema = z.object({
  name: z.string().min(2),

  studentId: z.string().min(2),

  collegeEmail: z.string().email(),

  personalEmail: z.string().email(),

  password: z.string().min(8),

  phone: z.string().min(10),

  branch: z.string().min(2),

  yearOfStudy: z.enum(YEAR_OF_STUDY),

  batchYear: z.number(),

  passedOutYear: z.number(),

  campus: z.enum(CAMPUSES),

  skills: z.array(z.string()).optional().default([]),

  linkedinProfile: z.string().optional().default(''),

  githubProfile: z.string().optional().default('')
});

export const loginSchema = z.object({
  loginId: z.string().min(3),
  password: z.string().min(8)
});

export const forgotPasswordSchema = z.object({
  email: z.string().email()
});

export const resetPasswordSchema = z.object({
  password: z.string().min(8, "Password must be at least 8 characters")
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(8),
  newPassword: z.string().min(8)
});