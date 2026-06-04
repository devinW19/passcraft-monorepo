/**
 * ============================================================
 * FILE: node-backend/src/models/Event.js
 * ============================================================
 * OWNER:        Team Member 3 (Backend Developer — Node.js)
 * TECHNOLOGIES: Node.js, Mongoose, MongoDB
 *
 * INSTRUCTIONS FOR TEAM MEMBER 3:
 * ─────────────────────────────────────────────────────────────
 * Define the Mongoose schema and model for the Event collection.
 * Each document in this collection represents one published event.
 * The `organizer` field creates a MongoDB reference (foreign key
 * equivalent) to the User collection.
 *
 * STEPS TO IMPLEMENT:
 *
 * 1. Imports:
 *    - `const mongoose = require('mongoose');`
 *
 * 2. Event Schema Definition:
 *    - Create a new Schema with the following fields:
 *
 *    title: {
 *      type: String,
 *      required: [true, 'Event title is required'],
 *      trim: true,
 *      maxlength: [120, 'Title cannot exceed 120 characters'],
 *    }
 *
 *    description: {
 *      type: String,
 *      required: [true, 'Event description is required'],
 *      maxlength: [2000, 'Description cannot exceed 2000 characters'],
 *    }
 *
 *    category: {
 *      type: String,
 *      required: true,
 *      enum: ['Music', 'Tech', 'Sports', 'Food & Drink',
 *             'Arts', 'Business', 'Health', 'Other'],
 *      default: 'Other',
 *    }
 *
 *    date: {
 *      type: Date,
 *      required: [true, 'Event date and time is required'],
 *      // Store as a full ISO 8601 Date object (e.g., 2025-03-15T19:00:00Z).
 *      // Validate that the date is in the future when creating an event.
 *    }
 *
 *    location: {
 *      type: String,
 *      required: [true, 'Event location is required'],
 *      trim: true,
 *    }
 *
 *    venue: {
 *      type: String,
 *      trim: true,
 *      // Physical venue name (e.g., 'Madison Square Garden').
 *      // Optional — for virtual events, location may be a URL.
 *    }
 *
 *    price: {
 *      type: Number,
 *      required: [true, 'Price is required'],
 *      min: [0, 'Price cannot be negative'],
 *      default: 0,
 *      // 0 = free event. Store in USD cents if working with
 *      // a payment gateway like Stripe to avoid floating point issues.
 *    }
 *
 *    imageUrl: {
 *      type: String,
 *      default: '',
 *      // URL to the event's banner/thumbnail image.
 *      // Stored in Azure Blob Storage — only save the URL here.
 *    }
 *
 *    totalSeats: {
 *      type: Number,
 *      required: true,
 *      min: [1, 'Event must have at least 1 seat'],
 *    }
 *
 *    availableSeats: {
 *      type: Number,
 *      // Initialise to totalSeats in the pre-save hook.
 *      // Decremented each time a booking is created.
 *      // Ensure availableSeats >= 0 (validate in booking logic).
 *    }
 *
 *    organizer: {
 *      type: mongoose.Schema.Types.ObjectId,
 *      ref: 'User',
 *      required: true,
 *      // This creates a reference to the User document.
 *      // Use .populate('organizer', 'name email') in queries
 *      // to join user data without duplicating it.
 *    }
 *
 *    isPublished: {
 *      type: Boolean,
 *      default: false,
 *      // Organizers can save drafts before publishing.
 *      // Only published events appear on the Home page.
 *    }
 *
 *    tags: {
 *      type: [String],
 *      default: [],
 *      // Array of searchable tags (e.g., ['jazz', 'outdoor']).
 *    }
 *
 *    - Schema Options:
 *        { timestamps: true }
 *
 * 3. Pre-Save Hook — Seat Initialisation:
 *    - Attach a pre-save hook:
 *        EventSchema.pre('save', function(next) {
 *          if (this.isNew) {
 *            this.availableSeats = this.totalSeats;
 *          }
 *          next();
 *        });
 *
 * 4. Index Definitions (for query performance):
 *    - Add a compound index on { date: 1, category: 1 } for
 *      the most common query pattern (filter by category, sort by date).
 *    - Add a text index on { title: 'text', description: 'text' }
 *      to enable full-text search via MongoDB's $text operator.
 *
 * 5. Model Export:
 *    - `module.exports = mongoose.model('Event', EventSchema);`
 * ============================================================
 */
