/**
 * ============================================================
 * FILE: frontend/src/components/EventCard.jsx
 * ============================================================
 * OWNER:        Team Member 1 (Frontend Developer)
 * TECHNOLOGIES: React 18, JSX, PropTypes, CSS3 (Card Layout),
 *               React Router v6
 *
 * INSTRUCTIONS FOR TEAM MEMBER 1:
 * ─────────────────────────────────────────────────────────────
 * Build a reusable presentational component that renders a single
 * event as a visually rich card. It receives all data through
 * props and has no internal data-fetching logic. It is rendered
 * inside a grid on the Home.jsx page.
 *
 * STEPS TO IMPLEMENT:
 *
 * 1. Imports:
 *    - Import React from 'react'.
 *    - Import PropTypes from 'prop-types'.
 *    - Import { Link } from 'react-router-dom'.
 *    - Import a date formatter: import { format } from 'date-fns'
 *      (or use Intl.DateTimeFormat natively).
 *
 * 2. Component Definition:
 *    - Export a default functional component:
 *        `export default function EventCard({ event }) {}`
 *    - Destructure the event prop object:
 *        `const { _id, title, description, date, location,
 *                price, imageUrl, category, availableSeats } = event;`
 *
 * 3. Date Formatting:
 *    - Format the raw ISO date string from the API using
 *      `format(new Date(date), 'EEE, MMM d · h:mm a')` to
 *      produce a human-readable date string like:
 *      "Sat, Jan 25 · 7:00 PM".
 *
 * 4. JSX Structure to Build:
 *    <article className="event-card">
 *
 *      // Card Image Section:
 *      <div className="event-card__image-wrapper">
 *        <img
 *          src={imageUrl || '/placeholder-event.jpg'}
 *          alt={title}
 *          className="event-card__image"
 *          loading="lazy"
 *        />
 *        // Category Badge (overlay on image):
 *        <span className="event-card__category">{category}</span>
 *      </div>
 *
 *      // Card Body:
 *      <div className="event-card__body">
 *        <h3 className="event-card__title">{title}</h3>
 *
 *        // Date & Location Row:
 *        <div className="event-card__meta">
 *          <span className="event-card__date">📅 {formattedDate}</span>
 *          <span className="event-card__location">📍 {location}</span>
 *        </div>
 *
 *        <p className="event-card__description">
 *          {description.length > 100
 *            ? description.slice(0, 100) + '...'
 *            : description}
 *        </p>
 *      </div>
 *
 *      // Card Footer:
 *      <div className="event-card__footer">
 *        <div className="event-card__price-block">
 *          <span className="event-card__price">
 *            {price === 0 ? 'Free' : `$${price}`}
 *          </span>
 *          <span className="event-card__seats">
 *            {availableSeats} seats left
 *          </span>
 *        </div>
 *        <Link to={`/events/${_id}`} className="btn btn-primary">
 *          View Details
 *        </Link>
 *      </div>
 *
 *    </article>
 *
 * 5. CSS Classes to Style (in global.css or EventCard.css):
 *    - .event-card: background var(--color-surface), border-radius
 *      var(--radius-lg), overflow hidden, box-shadow var(--shadow-sm),
 *      transition transform + shadow, flex-column layout.
 *    - .event-card:hover: translateY(-6px), shadow-md upgrade.
 *    - .event-card__image-wrapper: position relative, height 200px,
 *      overflow hidden.
 *    - .event-card__image: width 100%, height 100%, object-fit cover,
 *      transition transform 0.4s on card hover (scale 1.05).
 *    - .event-card__category: position absolute top-right, pill badge,
 *      background var(--color-primary), white text.
 *    - .event-card__body: padding, flex-grow 1.
 *    - .event-card__footer: padding, flex row, justify-between,
 *      align-center, border-top var(--color-border).
 *    - .event-card__price: font-weight 700, color var(--color-primary),
 *      font-size text-xl.
 *
 * 6. PropTypes Validation:
 *    EventCard.propTypes = {
 *      event: PropTypes.shape({
 *        _id:            PropTypes.string.isRequired,
 *        title:          PropTypes.string.isRequired,
 *        description:    PropTypes.string.isRequired,
 *        date:           PropTypes.string.isRequired,
 *        location:       PropTypes.string.isRequired,
 *        price:          PropTypes.number.isRequired,
 *        imageUrl:       PropTypes.string,
 *        category:       PropTypes.string,
 *        availableSeats: PropTypes.number.isRequired,
 *      }).isRequired,
 *    };
 * ============================================================
 */
