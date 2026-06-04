/**
 * ============================================================
 * FILE: node-backend/src/routes/authRoutes.js
 * ============================================================
 * OWNER:        Team Member 3 (Backend Developer — Node.js)
 * TECHNOLOGIES: Node.js, Express.js (Router), authController,
 *               authMiddleware
 *
 * INSTRUCTIONS FOR TEAM MEMBER 3:
 * ─────────────────────────────────────────────────────────────
 * This file defines the Express Router for all authentication-
 * related endpoints. All routes here are PUBLIC (no middleware
 * auth guard) except for the /me endpoint which requires a
 * valid JWT. Mount this router in server.js at: /api/auth
 *
 * STEPS TO IMPLEMENT:
 *
 * 1. Imports:
 *    - `const express = require('express');`
 *    - `const router = express.Router();`
 *    - `const { registerUser, loginUser, getMe } = require('../controllers/authController');`
 *    - `const { protect } = require('../middleware/authMiddleware');`
 *
 * 2. Route Definitions:
 *
 *    POST /api/auth/register → registerUser
 *    - Maps to the user registration handler in authController.
 *    - Body: { name, email, password }
 *    - Returns: { _id, name, email, role, token }
 *    - No middleware guard (public endpoint).
 *        router.post('/register', registerUser);
 *
 *    POST /api/auth/login → loginUser
 *    - Maps to the login handler in authController.
 *    - Body: { email, password }
 *    - Returns: { _id, name, email, role, token }
 *    - No middleware guard (public endpoint).
 *        router.post('/login', loginUser);
 *
 *    GET /api/auth/me → getMe (PROTECTED)
 *    - Returns the current authenticated user's profile data.
 *    - Requires: Authorization: Bearer <token> header.
 *    - The `protect` middleware runs first to validate the JWT
 *      and attach req.user before the getMe handler executes.
 *    - Used by the frontend AuthContext on app startup to
 *      verify session validity.
 *        router.get('/me', protect, getMe);
 *
 * 3. Input Validation Middleware (recommended — add before controllers):
 *    - Consider using `express-validator` to validate request bodies:
 *        const { body, validationResult } = require('express-validator');
 *        const validateRegister = [
 *          body('name').trim().notEmpty().isLength({ min: 2 }),
 *          body('email').isEmail().normalizeEmail(),
 *          body('password').isLength({ min: 8 }),
 *          (req, res, next) => {
 *            const errors = validationResult(req);
 *            if (!errors.isEmpty()) {
 *              return res.status(400).json({ errors: errors.array() });
 *            }
 *            next();
 *          }
 *        ];
 *    - Apply as: `router.post('/register', validateRegister, registerUser);`
 *
 * 4. Rate Limiting (security — add before controllers):
 *    - To prevent brute-force attacks on login:
 *        const rateLimit = require('express-rate-limit');
 *        const loginLimiter = rateLimit({
 *          windowMs: 15 * 60 * 1000, // 15 minutes
 *          max: 10,                   // 10 attempts per window
 *          message: 'Too many login attempts. Try again in 15 minutes.',
 *        });
 *    - Apply as: `router.post('/login', loginLimiter, loginUser);`
 *
 * 5. Export the Router:
 *    - `module.exports = router;`
 * ============================================================
 */
