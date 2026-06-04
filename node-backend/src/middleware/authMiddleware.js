/**
 * ============================================================
 * FILE: node-backend/src/middleware/authMiddleware.js
 * ============================================================
 * OWNER:        Team Member 3 (Backend Developer — Node.js)
 * TECHNOLOGIES: Node.js, Express.js, jsonwebtoken (JWT),
 *               Mongoose (User model lookup)
 *
 * INSTRUCTIONS FOR TEAM MEMBER 3:
 * ─────────────────────────────────────────────────────────────
 * This module exports Express middleware functions that intercept
 * incoming requests to protected routes, validate the JWT, and
 * attach the authenticated user object to the request. It must
 * be imported and applied in eventRoutes.js (and any other
 * protected route files).
 *
 * STEPS TO IMPLEMENT:
 *
 * 1. Imports:
 *    - `const jwt = require('jsonwebtoken');`
 *    - `const User = require('../models/User');`
 *    - `const asyncHandler = require('express-async-handler');`
 *      (Install express-async-handler to avoid try/catch boilerplate
 *      in every async middleware. It wraps async functions and
 *      forwards errors to the Express error handler automatically.)
 *
 * 2. `protect` Middleware (Primary Auth Guard):
 *    - This is the main middleware applied to all protected routes.
 *    - Export it as a named export:
 *        `exports.protect = asyncHandler(async (req, res, next) => { ... })`
 *
 *    - Step 2a — Extract the token from the Authorization header:
 *        const authHeader = req.headers.authorization;
 *        if (authHeader && authHeader.startsWith('Bearer ')) {
 *          token = authHeader.split(' ')[1];
 *          // Token format: "Bearer eyJhbGciOiJIUzI1NiJ9...."
 *        }
 *        if (!token) {
 *          res.status(401);
 *          throw new Error('Not authorized — no token provided');
 *        }
 *
 *    - Step 2b — Verify the token signature and expiry:
 *        const decoded = jwt.verify(token, process.env.JWT_SECRET);
 *        // jwt.verify() will throw a JsonWebTokenError if the
 *        // signature is invalid, or a TokenExpiredError if expired.
 *        // Both errors propagate to Express's error handler.
 *
 *    - Step 2c — Fetch the user from the database:
 *        req.user = await User.findById(decoded.id).select('-password');
 *        // Do NOT include the password hash in req.user.
 *        // Fetching from DB (rather than trusting JWT payload)
 *        // ensures deleted or suspended users are rejected even
 *        // if their token hasn't expired yet.
 *        if (!req.user) {
 *          res.status(401);
 *          throw new Error('Not authorized — user no longer exists');
 *        }
 *
 *    - Step 2d — Call next() to pass control to the route handler:
 *        next();
 *
 * 3. `authorizeRoles` Middleware (Role-Based Access Control):
 *    - Export a factory middleware for role-based restrictions:
 *        `exports.authorizeRoles = (...roles) => {`
 *        `  return (req, res, next) => {`
 *        `    if (!roles.includes(req.user.role)) {`
 *        `      res.status(403);`
 *        `      throw new Error(`
 *        `        \`Role '${req.user.role}' is not authorized for this route\``
 *        `      );`
 *        `    }`
 *        `    next();`
 *        `  };`
 *        `};`
 *    - Usage in routes:
 *        router.delete('/events/:id',
 *          protect,
 *          authorizeRoles('admin', 'organizer'),
 *          deleteEvent
 *        );
 *
 * 4. HTTP Status Code Reference:
 *    - 401 Unauthorized: No token, invalid token, expired token,
 *      user not found.
 *    - 403 Forbidden: Valid token but insufficient role/permissions.
 * ============================================================
 */
