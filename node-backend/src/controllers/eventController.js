/**
 * ============================================================
 * FILE: node-backend/src/controllers/eventController.js
 * ============================================================
 * OWNER:        Team Member 4 (Backend Developer — Events & Bookings)
 * TECHNOLOGIES: Node.js, Express.js, Mongoose (Event & Booking
 *               models), express-async-handler
 *
 * INSTRUCTIONS FOR TEAM MEMBER 4:
 * ─────────────────────────────────────────────────────────────
 * This controller contains all CRUD operations for Events and
 * the booking transaction logic. It is wired to routes in
 * eventRoutes.js. Use asyncHandler for all async route handlers.
 *
 * STEPS TO IMPLEMENT:
 *
 * 1. Imports:
 *    - `const asyncHandler = require('express-async-handler');`
 *    - `const Event = require('../models/Event');`
 *    - `const Booking = require('../models/Booking');`
 *
 * 2. `getAllEvents` — GET /api/events (Public):
 *    - Query the DB with optional filters from query strings:
 *        const { category, search, page = 1, limit = 12 } = req.query;
 *    - Build a query filter object:
 *        if (category && category !== 'All') query.category = category;
 *        if (search) query.$text = { $search: search };
 *    - Add pagination using .skip() and .limit():
 *        const skip = (page - 1) * limit;
 *        events = await Event.find({ isPublished: true, ...query })
 *          .populate('organizer', 'name')
 *          .sort({ date: 1 })
 *          .skip(skip)
 *          .limit(Number(limit));
 *    - Return total count for pagination controls:
 *        const total = await Event.countDocuments({ isPublished: true, ...query });
 *        res.json({ events, total, page, totalPages: Math.ceil(total / limit) });
 *
 * 3. `getEventById` — GET /api/events/:id (Public):
 *    - `const event = await Event.findById(req.params.id).populate('organizer', 'name email');`
 *    - If not found: `res.status(404); throw new Error('Event not found');`
 *    - Respond with: `res.json(event);`
 *
 * 4. `createEvent` — POST /api/events (Protected — Organizer/Admin):
 *    - Extract fields from req.body.
 *    - Set organizer: req.user._id (from the protect middleware).
 *    - `const event = await Event.create({ ...req.body, organizer: req.user._id });`
 *    - Respond with 201 and the new event document.
 *
 * 5. `updateEvent` — PUT /api/events/:id (Protected — Owner/Admin):
 *    - Find the event: `const event = await Event.findById(req.params.id);`
 *    - Authorisation check:
 *        if (event.organizer.toString() !== req.user._id.toString()
 *            && req.user.role !== 'admin') {
 *          res.status(403); throw new Error('Not authorised to edit this event');
 *        }
 *    - Update: `const updated = await Event.findByIdAndUpdate(req.params.id,
 *        req.body, { new: true, runValidators: true });`
 *    - Respond with the updated document.
 *
 * 6. `deleteEvent` — DELETE /api/events/:id (Protected — Owner/Admin):
 *    - Find the event and apply the same ownership/role authorisation check.
 *    - `await Event.findByIdAndDelete(req.params.id);`
 *    - Also delete all Bookings referencing this event:
 *        `await Booking.deleteMany({ event: req.params.id });`
 *    - Respond with: `res.json({ message: 'Event deleted successfully' });`
 *
 * 7. `createBooking` — POST /api/events/:id/book (Protected — User):
 *    - Find the target event by req.params.id.
 *    - Check availability:
 *        if (event.availableSeats < req.body.quantity) {
 *          res.status(400); throw new Error('Not enough seats available');
 *        }
 *    - Calculate total amount: `const totalAmount = event.price * req.body.quantity;`
 *    - Create the booking document:
 *        `const booking = await Booking.create({`
 *        `  user:        req.user._id,`
 *        `  event:       event._id,`
 *        `  quantity:    req.body.quantity,`
 *        `  totalAmount,`
 *        `});`
 *    - The post-save hook in Booking.js will auto-decrement availableSeats.
 *    - Respond with 201 and the populated booking.
 *
 * 8. `getUserBookings` — GET /api/events/my-bookings (Protected — User):
 *    - `const bookings = await Booking.find({ user: req.user._id })`
 *        `.populate('event', 'title date location imageUrl')`
 *        `.sort({ createdAt: -1 });`
 *    - Respond with: `res.json(bookings);`
 * ============================================================
 */
