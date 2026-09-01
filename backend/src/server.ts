import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { initDatabase } from './config/db.js';
import { seedInitialData } from './services/seedData.js';
import { apiLimiter } from './middleware/rateLimiter.js';
import { errorHandler } from './middleware/errorHandler.js';

import authRouter from './routes/auth.js';
import levelsRouter from './routes/levels.js';
import assessmentsRouter from './routes/assessments.js';
import labsRouter from './routes/labs.js';
import alertsRouter from './routes/alerts.js';
import reportsRouter from './routes/reports.js';
import mentorRouter from './routes/mentor.js';
import certificateRouter from './routes/certificate.js';
import progressRouter from './routes/progress.js';
import adminRouter from './routes/admin.js';

dotenv.config();

// Critical Environment Variable Validations
if (!process.env.JWT_SECRET || process.env.JWT_SECRET.trim() === '') {
  console.error('FATAL: JWT_SECRET environment variable is not defined. The server cannot start without a secure JWT_SECRET.');
  process.exit(1);
}

if (process.env.NODE_ENV === 'production' && (!process.env.CLIENT_ORIGIN || process.env.CLIENT_ORIGIN.trim() === '')) {
  console.error('FATAL: CLIENT_ORIGIN environment variable is required in production.');
  process.exit(1);
}

// Initialize DB schema & seed data
initDatabase();
seedInitialData();

const app = express();
const PORT = process.env.PORT || 5001;

// Determine safe CORS allowed origins
const safeDevOrigins = ['http://localhost:5173', 'http://localhost:3000', 'http://127.0.0.1:5173', 'http://127.0.0.1:3000'];
const configuredOrigins = process.env.CLIENT_ORIGIN
  ? process.env.CLIENT_ORIGIN.split(',').map(o => o.trim())
  : safeDevOrigins;

// Security & utility middlewares
app.use(helmet());
app.use(cors({
  origin: (origin, callback) => {
    // Allow server-to-server or tools without origin header (e.g. curl, tests)
    if (!origin) return callback(null, true);
    if (configuredOrigins.includes(origin) || configuredOrigins.includes('*')) {
      return callback(null, true);
    }
    return callback(new Error(`Blocked by CORS policy: origin ${origin} is not allowed`));
  },
  credentials: true
}));
app.use(express.json({ limit: '5mb' }));
app.use(morgan('dev'));
app.use('/api/', apiLimiter);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'LMCYS Cyber Training & SOC Arena API',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// Register Core APIs
app.use('/api/auth', authRouter);
app.use('/api/levels', levelsRouter);
app.use('/api/modules', levelsRouter);
app.use('/api/assessments', assessmentsRouter);
app.use('/api/labs', labsRouter);
app.use('/api/alerts', alertsRouter);
app.use('/api/reports', reportsRouter);
app.use('/api/mentor', mentorRouter);
app.use('/api/certificates', certificateRouter);
app.use('/api/progress', progressRouter);
app.use('/api/admin', adminRouter);

// Central error handler
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🛡️  LMCYS Cyber Defense API Server running on port ${PORT}`);
  console.log(`🚀 Ready for SOC Cadet training & practical investigations.`);
});

export default app;
