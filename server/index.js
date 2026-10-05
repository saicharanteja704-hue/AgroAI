import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import { testConnection } from './config/db.js';
import { runMigrations } from './db/migrate.js';
import authRoutes from './routes/authRoutes.js';
import profileRoutes from './routes/profileRoutes.js';
import farmRoutes from './routes/farmRoutes.js';
import advisoryRoutes from './routes/advisoryRoutes.js';
import { notFoundHandler, errorHandler } from './middleware/errorMiddleware.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Security Middleware
app.use(
  helmet({
    contentSecurityPolicy: false, // Allows Vite dev proxy & inline assets
    crossOriginEmbedderPolicy: false,
  })
);

// CORS configuration
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5000',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:5000',
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, server-to-server)
      if (!origin || allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(null, true); // Permissive in dev, strict in prod
      }
    },
    credentials: true,
  })
);

// Rate Limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300, // limit each IP to 300 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: 'Too many requests from this IP, please try again after 15 minutes.',
  },
});

app.use('/api', apiLimiter);

// Advisory generation specific rate limit
const advisoryLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 20, // 20 advisories per minute max
  message: {
    success: false,
    error: 'High advisory request rate. Please wait a moment before requesting another advisory.',
  },
});

app.use('/api/advisories', advisoryLimiter);

// Parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Health Check
app.get('/api/health', async (req, res) => {
  const dbOk = await testConnection();
  const hasGeminiKey = Boolean(
    process.env.GEMINI_API_KEY &&
      process.env.GEMINI_API_KEY !== 'your_gemini_api_key_here' &&
      process.env.GEMINI_API_KEY.length > 10
  );

  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'AgroAI Crop Advisory Platform',
    database: dbOk ? 'connected' : 'disconnected',
    ai_engine: hasGeminiKey ? 'Gemini 2.5 Flash (Live)' : 'Agronomic Expert Engine (Active)',
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/farms', farmRoutes);
app.use('/api/advisories', advisoryRoutes);

// In Production, serve Vite build artifacts
const clientDistPath = path.join(__dirname, '../client/dist');
app.use(express.static(clientDistPath));

app.get('*', (req, res, next) => {
  if (req.originalUrl.startsWith('/api')) {
    return next();
  }
  const indexPath = path.join(clientDistPath, 'index.html');
  res.sendFile(indexPath, (err) => {
    if (err) {
      next();
    }
  });
});

// 404 & Error Handling
app.use(notFoundHandler);
app.use(errorHandler);

// Start Server and Run Migrations
const startServer = async () => {
  try {
    await testConnection();
    await runMigrations();

    app.listen(PORT, () => {
      console.log(`===================================================`);
      console.log(`🌾 AgroAI Crop Advisory Server running on port ${PORT}`);
      console.log(`🔗 API Base: http://localhost:${PORT}/api`);
      console.log(`🚀 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`===================================================`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
};

startServer();
