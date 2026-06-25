import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';

import { env } from './config/env.js';
import { errorHandler, notFound } from './middleware/error.middleware.js';
import authRoutes from './routes/auth.routes.js';
import campusRoutes from './routes/campus.routes.js';
import userRoutes from './routes/user.routes.js';
import eventRoutes from './routes/event.routes.js';
import jobRoutes from './routes/job.routes.js';
import taskRoutes from './routes/task.routes.js';
import notificationRoutes from './routes/notification.routes.js';
import chatRoutes from './routes/chat.routes.js';
import dashboardRoutes from './routes/dashboard.routes.js';
import placementRoutes from './routes/placement.routes.js';
import entrepreneurshipRoutes from './routes/entrepreneurship.routes.js';
import incubationRoutes from './routes/incubation.routes.js';
import exportRoutes from './routes/export.routes.js';
import announcementRoutes from "./routes/announcement.routes.js";

export function createApp() {
  const app = express();

  app.use(helmet());
  app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }));
  app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 300 }));
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());
  app.use(morgan(env.NODE_ENV === 'production' ? 'combined' : 'dev'));

  app.get('/api/health', (_req, res) => {
    res.json({ success: true, status: 'ok', service: 'eitp-backend' });
  });

  app.use('/api/auth', authRoutes);
  app.use('/api/users', userRoutes);
  app.use('/api/campuses', campusRoutes);
  app.use('/api/events', eventRoutes);
  app.use('/api/jobs', jobRoutes);
  app.use('/api/tasks', taskRoutes);
  app.use('/api/notifications', notificationRoutes);
  app.use('/api/chat', chatRoutes);
  app.use('/api/dashboard', dashboardRoutes);
  app.use('/api/placements', placementRoutes);
  app.use('/api/entrepreneurship', entrepreneurshipRoutes);
  app.use('/api/incubation', incubationRoutes);
  app.use('/api/exports', exportRoutes);

app.use(
    "/api/announcements",
    announcementRoutes
);

  app.use(notFound);
  app.use(errorHandler);

  return app;
}
