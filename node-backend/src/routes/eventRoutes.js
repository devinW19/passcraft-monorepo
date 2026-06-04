/**
 * ============================================================
 * FILE: node-backend/src/routes/eventRoutes.js
 * ============================================================
 * OWNER:        Team Member 4 (Backend Developer — Events & Bookings)
 * TECHNOLOGIES: Node.js, Express.js (Router), eventController,
 *               authMiddleware (protect, authorizeRoles)
 *
 * INSTRUCTIONS FOR TEAM MEMBER 4:
 * ─────────────────────────────────────────────────────────────
 * This file defines the Express Router for all event and booking
 * endpoints. Public read endpoints have no guard; write endpoints
 * require authentication; destructive or admin operations also
 * require role authorisation. Mount this router in server.js
 * at path prefix: /api/events
 *
 * STEPS TO IMPLEMENT:
 *
 * 1. Imports:
 *    - `const express = require('express');`
 *    - `const router = express.Router();`
 *    - `const {`
 *        `  getAllEvents, getEventById, createEvent,`
 *        `  updateEvent, deleteEvent, createBooking,`
 *        `  getUserBookings`
 *        `} = require('../controllers/eventController');`
 *    - `const { protect, authorizeRoles } = require('../middleware/authMiddleware');`
 *
 * 2. PUBLIC Routes (no middleware guard):
 *
 *    GET /api/events → getAllEvents
 *    - Returns paginated, filtered list of published events.
 *    - Supports query params: ?category=Music&search=jazz&page=1&limit=12
 *        router.get('/', getAllEvents);
 *
 *    GET /api/events/:id → getEventById
 *    - Returns a single event document with organizer populated.
 *        router.get('/:id', getEventById);
 *
 * 3. PROTECTED Routes — Any Authenticated User:
 *
 *    GET /api/events/my-bookings → getUserBookings
 *    - Returns all bookings belonging to the requesting user.
 *    - IMPORTANT: Define this route BEFORE '/:id' to prevent
 *      Express from matching 'my-bookings' as a dynamic :id param.
 *        router.get('/my-bookings', protect, getUserBookings);
 *
 *    POST /api/events/:id/book → createBooking
 *    - Creates a new booking for the specified event.
 *    - Body: { quantity: Number }
 *        router.post('/:id/book', protect, createBooking);
 *
 * 4. PROTECTED Routes — Organizer or Admin Role Required:
 *
 *    POST /api/events → createEvent
 *    - Creates a new event document.
 *    - Body: Full event object per Event schema.
 *        router.post('/', protect, authorizeRoles('organizer', 'admin'), createEvent);
 *
 *    PUT /api/events/:id → updateEvent
 *    - Updates an existing event (must be the organizer or admin).
 *    - Body: Partial event object with fields to update.
 *        router.put('/:id', protect, authorizeRoles('organizer', 'admin'), updateEvent);
 *
 *    DELETE /api/events/:id → deleteEvent
 *    - Deletes an event and all related booking records.
 *        router.delete('/:id', protect, authorizeRoles('organizer', 'admin'), deleteEvent);
 *
 * 5. Route Ordering Note:
 *    - Express matches routes in the ORDER they are defined.
 *    - Static paths (e.g., '/my-bookings') MUST be registered
 *      BEFORE dynamic paths (e.g., '/:id') to avoid mismatches.
 *    - Ensure '/my-bookings' appears before '/:id' in this file.
 *
 * 6. Export the Router:
 *    - `module.exports = router;`
 * ============================================================
 */
