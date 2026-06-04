/**
 * ============================================================
 * FILE: node-backend/src/models/Booking.js
 * ============================================================
 * OWNER:        Team Member 3 (Backend Developer — Node.js)
 * TECHNOLOGIES: Node.js, Mongoose, MongoDB
 *
 * INSTRUCTIONS FOR TEAM MEMBER 3:
 * ─────────────────────────────────────────────────────────────
 * Define the Mongoose schema and model for the Booking collection.
 * Each document represents a single transactional booking record,
 * linking a User to an Event. This is the relational "join table"
 * equivalent in MongoDB's document model.
 *
 * STEPS TO IMPLEMENT:
 *
 * 1. Imports:
 *    - `const mongoose = require('mongoose');`
 *
 * 2. Booking Schema Definition:
 *    - Create a new Schema with the following fields:
 *
 *    user: {
 *      type: mongoose.Schema.Types.ObjectId,
 *      ref: 'User',
 *      required: [true, 'Booking must be associated with a user'],
 *      // Reference to the User who made this booking.
 *      // Use .populate('user', 'name email') in API responses.
 *    }
 *
 *    event: {
 *      type: mongoose.Schema.Types.ObjectId,
 *      ref: 'Event',
 *      required: [true, 'Booking must be associated with an event'],
 *      // Reference to the Event being booked.
 *      // Use .populate('event', 'title date location price') in responses.
 *    }
 *
 *    quantity: {
 *      type: Number,
 *      required: true,
 *      min: [1, 'Must book at least 1 ticket'],
 *      max: [10, 'Cannot book more than 10 tickets per transaction'],
 *      default: 1,
 *    }
 *
 *    totalAmount: {
 *      type: Number,
 *      required: true,
 *      // Calculated as: event.price * quantity
 *      // Stored redundantly here so that price changes to the
 *      // event later do NOT retroactively alter booking records.
 *    }
 *
 *    status: {
 *      type: String,
 *      enum: ['pending', 'confirmed', 'cancelled', 'refunded'],
 *      default: 'confirmed',
 *      // 'pending'   — payment initiated but not yet confirmed.
 *      // 'confirmed' — booking active, ticket issued.
 *      // 'cancelled' — user-initiated cancellation.
 *      // 'refunded'  — refund processed (for paid events).
 *    }
 *
 *    ticketNumber: {
 *      type: String,
 *      unique: true,
 *      // A human-readable unique ticket identifier.
 *      // Generate this in the pre-save hook using a combination
 *      // of a random alphanumeric string and the booking's _id.
 *      // Format suggestion: 'PC-2025-XYZABC12'
 *    }
 *
 *    paymentReference: {
 *      type: String,
 *      default: null,
 *      // Store the payment gateway transaction ID here
 *      // (e.g., Stripe PaymentIntent ID: 'pi_3OqA...'). 
 *      // Null for free events.
 *    }
 *
 *    ticketPdfUrl: {
 *      type: String,
 *      default: null,
 *      // URL to the generated PDF ticket in Azure Blob Storage.
 *      // This is populated by the Flask ticket_generator service
 *      // after the booking is created.
 *    }
 *
 *    - Schema Options:
 *        { timestamps: true }
 *
 * 3. Pre-Save Hook — Ticket Number Generation:
 *    - Attach a pre-save hook to auto-generate the ticketNumber:
 *        BookingSchema.pre('save', function(next) {
 *          if (this.isNew && !this.ticketNumber) {
 *            const randomPart = Math.random()
 *              .toString(36).substring(2, 10).toUpperCase();
 *            this.ticketNumber = `PC-${new Date().getFullYear()}-${randomPart}`;
 *          }
 *          next();
 *        });
 *
 * 4. Compound Index:
 *    - Create a unique compound index on { user, event } to
 *      prevent a user from booking the same event more than once:
 *        BookingSchema.index({ user: 1, event: 1 }, { unique: true });
 *    - If your business logic allows multiple bookings for the
 *      same event (e.g., buying more tickets later), remove
 *      unique: true and enforce the single-booking rule in
 *      the controller instead.
 *
 * 5. Post-Save Hook — Update Event Seat Count:
 *    - After a booking is successfully saved:
 *        BookingSchema.post('save', async function(doc) {
 *          await mongoose.model('Event').findByIdAndUpdate(
 *            doc.event,
 *            { $inc: { availableSeats: -doc.quantity } }
 *          );
 *        });
 *    - This atomically decrements the available seat count on
 *      the Event document after each confirmed booking.
 *
 * 6. Model Export:
 *    - `module.exports = mongoose.model('Booking', BookingSchema);`
 * ============================================================
 */
