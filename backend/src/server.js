import http from 'http';
import { createApp } from './app.js';
import { connectDB } from './config/db.js';
import { initSocket } from './sockets/index.js';
import { env } from './config/env.js';

async function bootstrap() {
  await connectDB();
  const app = createApp();
  const server = http.createServer(app);
  initSocket(server);

  server.listen(env.PORT, () => {
    console.log(`EITP backend running on port ${env.PORT}`);
  });
}

bootstrap().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});
