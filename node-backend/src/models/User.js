/**
 * ============================================================
 * FILE: node-backend/src/models/User.js
 * ============================================================
 * OWNER:        Team Member 3 (Backend Developer — Node.js)
 * TECHNOLOGIES: Node.js, Mongoose, bcryptjs (password hashing),
 *               MongoDB
 *
 * INSTRUCTIONS FOR TEAM MEMBER 3:
 * ─────────────────────────────────────────────────────────────
 * Define the Mongoose schema and model for the User collection.
 * This model handles user registration data and enforces data
 * integrity constraints. A pre-save middleware hook automatically
 * hashes the user's password before it is persisted to MongoDB,
 * so plaintext passwords are NEVER stored in the database.
 *
 * STEPS TO IMPLEMENT:
 *
 * 1. Imports:
 *    - `const mongoose = require('mongoose');`
 *    - `const bcrypt = require('bcryptjs');`
 *      (bcryptjs is a pure-JS implementation, preferred over
 *      bcrypt for Docker/Alpine compatibility — no native bindings.)
 *
 * 2. User Schema Definition:
 *    - Create a new Schema with the following fields:
 *
 *    name: {
 *      type: String,
 *      required: [true, 'Name is required'],
 *      trim: true,
 *      minlength: [2, 'Name must be at least 2 characters'],
 *      maxlength: [50, 'Name cannot exceed 50 characters'],
 *    }
 *
 *    email: {
 *      type: String,
 *      required: [true, 'Email is required'],
 *      unique: true,
 *      lowercase: true,
 *      trim: true,
 *      match: [
 *        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
 *        'Please enter a valid email address',
 *      ],
 *    }
 *
 *    password: {
 *      type: String,
 *      required: [true, 'Password is required'],
 *      minlength: [8, 'Password must be at least 8 characters'],
 *      select: false,
 *      // select: false ensures this field is EXCLUDED from query
 *      // results by default. Must be explicitly selected with
 *      // .select('+password') when needed (e.g., during login).
 *    }
 *
 *    role: {
 *      type: String,
 *      enum: ['user', 'organizer', 'admin'],
 *      default: 'user',
 *    }
 *
 *    avatar: {
 *      type: String,
 *      default: '',
 *      // URL string to a profile image (e.g., Gravatar URL or
 *      // Azure Blob Storage URL for uploaded avatars).
 *    }
 *
 *    isVerified: {
 *      type: Boolean,
 *      default: false,
 *      // For future email verification feature.
 *    }
 *
 *    - Schema Options:
 *        { timestamps: true }
 *      Automatically adds `createdAt` and `updatedAt` fields.
 *
 * 3. Pre-Save Middleware (Password Hashing):
 *    - Attach a pre-save hook on the UserSchema:
 *        UserSchema.pre('save', async function(next) {
 *          // Only hash if the password field has been modified
 *          // (prevents re-hashing on other field updates):
 *          if (!this.isModified('password')) return next();
 *
 *          // Generate a salt with cost factor 12:
 *          const salt = await bcrypt.genSalt(12);
 *
 *          // Hash the plaintext password with the salt:
 *          this.password = await bcrypt.hash(this.password, salt);
 *
 *          next();
 *        });
 *    - Cost factor 12 provides strong security while keeping
 *      hashing time under 300ms on modern hardware.
 *
 * 4. Instance Method (Password Verification):
 *    - Add a method to the schema for use during login:
 *        UserSchema.methods.matchPassword = async function(enteredPassword) {
 *          return await bcrypt.compare(enteredPassword, this.password);
 *        };
 *    - This is called in authController.js during login:
 *        const isMatch = await user.matchPassword(req.body.password);
 *
 * 5. Model Export:
 *    - `module.exports = mongoose.model('User', UserSchema);`
 * ============================================================
 */
