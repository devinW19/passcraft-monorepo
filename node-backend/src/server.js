/**
 * ============================================================
 * FILE: node-backend/src/server.js
 * ============================================================
 * OWNER:        Team Member 3 (Backend Developer — Node.js)
 * TECHNOLOGIES: Node.js, Express.js, CORS, Morgan (HTTP logger),
 *               Helmet (security headers), dotenv, Mongoose
 *
 * INSTRUCTIONS FOR TEAM MEMBER 3:
 * ─────────────────────────────────────────────────────────────
 * This is the main application entry point for the Node.js
 * backend. It configures the Express application, registers all
 * global middleware, mounts route handlers, attaches the global
 * error handler, connects to MongoDB, and starts the HTTP server
 * on the configured port.
 *
 * STEPS TO IMPLEMENT:
 *
 * 1. Environment Variable Loading (MUST be first):
 *    - `require('dotenv').config();`
 *    - This must be called BEFORE any other require statements
 *      that depend on process.env values (e.g., db.js reads
 *      MONGO_URI from process.env).
 *
 * 2. Imports:
 *    - `const express = require('express');`
 *    - `const cors    = require('cors');`
 *    - `const helmet  = require('helmet');`
 *    - `const morgan  = require('morgan');`
 *    - `const connectDB = require('./config/db');`
 *    - `const authRoutes  = require('./routes/authRoutes');`
 *    - `const eventRoutes = require('./routes/eventRoutes');`
 *
 * 3. Database Connection:
 *    - Call `connectDB();` immediately after imports.
 *    - This is an async function but we don't await it here;
 *      Mongoose queues operations and executes them once the
 *      connection is established. The server can start listening
 *      before the DB connection resolves (Mongoose buffers queries).
 *
 * 4. Express App Instantiation:
 *    - `const app = express();`
 *
 * 5. Security Middleware — register BEFORE routes:
 *
 *    a) Helmet (HTTP Security Headers):
 *       `app.use(helmet());`
 *       Helmet sets headers like X-XSS-Protection,
 *       X-Frame-Options, X-Content-Type-Options, HSTS, etc.
 *
 *    b) CORS Configuration:
 *       `app.use(cors({`
 *       `  origin: process.env.FRONTEND_URL || 'http://localhost:5173',`
 *       `  credentials: true,`
 *       `  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],`
 *       `  allowedHeaders: ['Content-Type', 'Authorization'],`
 *       `}));`
 *       - credentials: true is required if the frontend sends
 *         cookies (e.g., httpOnly cookie-based JWT strategy).
 *       - In production, FRONTEND_URL must be set to the exact
 *         deployed frontend domain (e.g., https://passcraft.io).
 *
 * 6. Body Parsing Middleware:
 *    - `app.use(express.json({ limit: '10mb' }));`
 *      Parse incoming requests with JSON payloads.
 *    - `app.use(express.urlencoded({ extended: true, limit: '10mb' }));`
 *      Parse URL-encoded form data.
 *
 * 7. HTTP Request Logger:
 *    - `if (process.env.NODE_ENV === 'development') {`
 *    - `  app.use(morgan('dev'));`
 *    - `}`
 *    - Morgan 'dev' format: METHOD URL STATUS RESPONSE-TIME
 *    - Only enable in development — log to a file in production.
 *
 * 8. Health Check Endpoint:
 *    - `app.get('/health', (req, res) => res.json({ status: 'ok', service: 'node-backend' }));`
 *    - Used by Docker Compose and Azure health probes to check
 *      service liveness without invoking business logic.
 *
 * 9. API Route Mounting:
 *    - `app.use('/api/auth',   authRoutes);`
 *    - `app.use('/api/events', eventRoutes);`
 *
 * 10. 404 Handler (must be AFTER all valid routes):
 *     - `app.use((req, res, next) => {`
 *     - `  res.status(404).json({ message: 'Route not found' });`
 *     - `});`
 *
 * 11. Global Error Handler (must be LAST middleware, 4 params):
 *     - `app.use((err, req, res, next) => {`
 *     - `  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;`
 *     - `  res.status(statusCode).json({`
 *     - `    message: err.message,`
 *     - `    stack: process.env.NODE_ENV === 'production' ? null : err.stack,`
 *     - `  });`
 *     - `});`
 *     - express-async-handler forwards errors thrown inside
 *       asyncHandler() wrappers to this global handler.
 *
 * 12. Server Listener:
 *     - `const PORT = process.env.PORT || 5000;`
 *     - `app.listen(PORT, () => console.log(`Server running on port ${PORT}`));`
 * ============================================================
 */
