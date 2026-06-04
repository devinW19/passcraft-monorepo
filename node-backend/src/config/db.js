/**
 * ============================================================
 * FILE: node-backend/src/config/db.js
 * ============================================================
 * OWNER:        Team Member 3 (Backend Developer — Node.js)
 * TECHNOLOGIES: Node.js, Mongoose (ODM), MongoDB,
 *               MongoDB Atlas (Cloud), dotenv
 *
 * INSTRUCTIONS FOR TEAM MEMBER 3:
 * ─────────────────────────────────────────────────────────────
 * This module establishes and exports the MongoDB database
 * connection using Mongoose. It is imported once at the top of
 * server.js during application startup. Connection events
 * (connected, error, disconnected) are logged for observability.
 *
 * STEPS TO IMPLEMENT:
 *
 * 1. Imports:
 *    - Import mongoose from 'mongoose'.
 *    - dotenv is already loaded in server.js via
 *      `dotenv.config()` before this module is imported, so
 *      process.env variables are available here.
 *
 * 2. Connection URI Resolution:
 *    - Read the MongoDB URI from environment variables:
 *        const MONGO_URI = process.env.MONGO_URI;
 *    - If MONGO_URI is undefined, throw an error immediately:
 *        if (!MONGO_URI) {
 *          throw new Error('MONGO_URI is not defined in .env');
 *        }
 *    - The .env file should contain one of:
 *        Local Docker:   MONGO_URI=mongodb://mongo:27017/passcraft
 *        Local native:   MONGO_URI=mongodb://localhost:27017/passcraft
 *        Atlas Cloud:    MONGO_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/passcraft
 *
 * 3. Mongoose Connection Options:
 *    - Pass an options object as the second argument to
 *      mongoose.connect() to avoid deprecation warnings:
 *        {
 *          useNewUrlParser:    true,
 *          useUnifiedTopology: true,
 *        }
 *      NOTE: In Mongoose 7+, these options are defaults and can
 *      be omitted. Confirm the Mongoose version being used.
 *
 * 4. Connection Function:
 *    - Export an async function named `connectDB`:
 *        const connectDB = async () => {
 *          try {
 *            const conn = await mongoose.connect(MONGO_URI, options);
 *            console.log(`MongoDB Connected: ${conn.connection.host}`);
 *          } catch (error) {
 *            console.error(`MongoDB Connection Error: ${error.message}`);
 *            process.exit(1);
 *            // process.exit(1) terminates the Node process with a
 *            // failure code if the DB cannot be reached at startup.
 *          }
 *        };
 *        module.exports = connectDB;
 *
 * 5. Connection Event Listeners (optional but recommended):
 *    - After the connection is established, add listeners:
 *        mongoose.connection.on('disconnected', () =>
 *          console.warn('MongoDB disconnected.'));
 *        mongoose.connection.on('reconnected', () =>
 *          console.info('MongoDB reconnected.'));
 *    - These help diagnose flapping connections in production.
 *
 * 6. Mongoose Global Settings (add before connectDB call):
 *    - mongoose.set('strictQuery', true):
 *      Only allow fields defined in the schema to be queried.
 *    - mongoose.set('debug', process.env.NODE_ENV === 'development'):
 *      Logs all Mongoose queries to stdout in dev mode — useful
 *      for debugging query performance.
 * ============================================================
 */
