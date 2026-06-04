/**
 * ============================================================
 * FILE: node-backend/src/controllers/authController.js
 * ============================================================
 * OWNER:        Team Member 3 (Backend Developer — Node.js)
 * TECHNOLOGIES: Node.js, Express.js, Mongoose (User model),
 *               jsonwebtoken, bcryptjs (via User model method),
 *               express-async-handler
 *
 * INSTRUCTIONS FOR TEAM MEMBER 3:
 * ─────────────────────────────────────────────────────────────
 * This controller contains the business logic for user
 * authentication: registration and login. It is wired to routes
 * in authRoutes.js. All route handler functions are wrapped in
 * asyncHandler to eliminate repetitive try/catch blocks.
 *
 * STEPS TO IMPLEMENT:
 *
 * 1. Imports:
 *    - `const asyncHandler = require('express-async-handler');`
 *    - `const jwt = require('jsonwebtoken');`
 *    - `const User = require('../models/User');`
 *
 * 2. Helper Function — `generateToken(userId)`:
 *    - Define a private helper (not exported) that creates a JWT:
 *        const generateToken = (id) => {
 *          return jwt.sign(
 *            { id },                            // payload
 *            process.env.JWT_SECRET,            // secret key from .env
 *            { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }  // expiry
 *          );
 *        };
 *    - The token payload contains only the user's MongoDB _id.
 *    - Do NOT include sensitive data (password, email) in the payload.
 *    - The JWT_SECRET must be a long, random, cryptographically
 *      secure string — never a dictionary word.
 *
 * 3. `registerUser` Handler — POST /api/auth/register:
 *    - Export as: `exports.registerUser = asyncHandler(async (req, res) => { ... })`
 *    - Step a: Destructure request body:
 *        const { name, email, password } = req.body;
 *    - Step b: Validate required fields:
 *        if (!name || !email || !password) {
 *          res.status(400); throw new Error('All fields are required');
 *        }
 *    - Step c: Check for duplicate email:
 *        const userExists = await User.findOne({ email });
 *        if (userExists) {
 *          res.status(409); throw new Error('User already exists with this email');
 *        }
 *    - Step d: Create the new user:
 *        const user = await User.create({ name, email, password });
 *        // User.create() triggers the pre-save bcrypt hook in User.js.
 *    - Step e: Respond with 201 Created and a new token:
 *        if (user) {
 *          res.status(201).json({
 *            _id:   user._id,
 *            name:  user.name,
 *            email: user.email,
 *            role:  user.role,
 *            token: generateToken(user._id),
 *          });
 *        } else {
 *          res.status(400); throw new Error('Invalid user data');
 *        }
 *
 * 4. `loginUser` Handler — POST /api/auth/login:
 *    - Export as: `exports.loginUser = asyncHandler(async (req, res) => { ... })`
 *    - Step a: Destructure request body:
 *        const { email, password } = req.body;
 *    - Step b: Find user by email, explicitly selecting password:
 *        const user = await User.findOne({ email }).select('+password');
 *        // .select('+password') is needed because the User schema
 *        // has { select: false } on the password field.
 *    - Step c: Verify user exists AND password matches:
 *        if (!user || !(await user.matchPassword(password))) {
 *          res.status(401);
 *          throw new Error('Invalid email or password');
 *        }
 *        // Use a GENERIC error message — never reveal whether the
 *        // email or password specifically was wrong (security best
 *        // practice to prevent user enumeration attacks).
 *    - Step d: Respond with 200 OK and a new token:
 *        res.status(200).json({
 *          _id:   user._id,
 *          name:  user.name,
 *          email: user.email,
 *          role:  user.role,
 *          token: generateToken(user._id),
 *        });
 *
 * 5. `getMe` Handler — GET /api/auth/me (Protected):
 *    - Export as: `exports.getMe = asyncHandler(async (req, res) => { ... })`
 *    - req.user is already populated by the `protect` middleware.
 *    - Simply respond with the user object:
 *        res.status(200).json(req.user);
 *    - This endpoint is used by the frontend on app load to
 *      verify the token is still valid and hydrate the user state.
 * ============================================================
 */
