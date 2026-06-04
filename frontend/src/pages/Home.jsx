/**
 * ============================================================
 * FILE: frontend/src/pages/Home.jsx
 * ============================================================
 * OWNER:        Team Member 1 (Frontend Developer)
 * TECHNOLOGIES: React 18, JSX, React Hooks (useState, useEffect),
 *               Axios / Fetch API, React Router v6,
 *               CSS Grid, CSS Custom Properties
 *
 * INSTRUCTIONS FOR TEAM MEMBER 1:
 * ─────────────────────────────────────────────────────────────
 * This is the main event discovery landing page. It fetches the
 * list of all public events from the Node.js backend and renders
 * them in a responsive grid using <EventCard> components. It also
 * includes search/filter UI for narrowing results.
 *
 * STEPS TO IMPLEMENT:
 *
 * 1. Imports:
 *    - Import React, { useState, useEffect } from 'react'.
 *    - Import EventCard from '../components/EventCard'.
 *    - Import Navbar from '../components/Navbar'.
 *    - Import axios (or use native fetch).
 *
 * 2. State Variables:
 *    const [events, setEvents]         = useState([]);
 *    const [filteredEvents, setFiltered] = useState([]);
 *    const [searchQuery, setSearch]    = useState('');
 *    const [selectedCategory, setCategory] = useState('All');
 *    const [isLoading, setIsLoading]   = useState(true);
 *    const [error, setError]           = useState(null);
 *
 * 3. useEffect — Data Fetching:
 *    - On component mount (empty dependency array []):
 *        setIsLoading(true);
 *        try {
 *          const res = await axios.get(
 *            `${import.meta.env.VITE_NODE_API_URL}/api/events`
 *          );
 *          setEvents(res.data);
 *          setFiltered(res.data);
 *        } catch (err) {
 *          setError('Failed to load events. Please try again.');
 *        } finally {
 *          setIsLoading(false);
 *        }
 *    - The backend GET /api/events endpoint returns an array
 *      of event objects matching the Event Mongoose schema.
 *
 * 4. Search & Filter Logic:
 *    - useEffect that runs whenever [searchQuery, selectedCategory,
 *      events] change:
 *        Filter the `events` array where:
 *          - event.title.toLowerCase().includes(searchQuery)
 *          - selectedCategory === 'All' OR event.category === selectedCategory
 *        Set the result to setFiltered([...]).
 *
 * 5. Category List:
 *    - Derive unique categories from the fetched events array:
 *        const categories = ['All', ...new Set(events.map(e => e.category))];
 *    - Render these as filter buttons / a dropdown above the grid.
 *
 * 6. JSX Structure to Build:
 *    <div className="home-page">
 *      <Navbar />
 *
 *      // Hero Section:
 *      <section className="hero">
 *        <h1 className="hero__title">Discover Amazing Events</h1>
 *        <p className="hero__subtitle">Book tickets and track your experience.</p>
 *        <div className="hero__search">
 *          <input
 *            type="search"
 *            placeholder="Search events by name..."
 *            value={searchQuery}
 *            onChange={(e) => setSearch(e.target.value)}
 *          />
 *        </div>
 *      </section>
 *
 *      // Category Filter Pills:
 *      <section className="filters container">
 *        {categories.map(cat => (
 *          <button
 *            key={cat}
 *            className={`filter-pill ${selectedCategory === cat ? 'active' : ''}`}
 *            onClick={() => setCategory(cat)}
 *          >{cat}</button>
 *        ))}
 *      </section>
 *
 *      // Events Grid:
 *      <main className="events-grid container">
 *        {isLoading && <p>Loading events...</p>}
 *        {error && <p className="error-message">{error}</p>}
 *        {!isLoading && filteredEvents.length === 0 && (
 *          <p className="no-results">No events found matching your search.</p>
 *        )}
 *        {filteredEvents.map(event => (
 *          <EventCard key={event._id} event={event} />
 *        ))}
 *      </main>
 *    </div>
 *
 * 7. CSS Classes (add in global.css or Home.css):
 *    - .hero: full-width banner, min-height 60vh, gradient
 *      background, flex-column center, text-center.
 *    - .hero__search input: max-width 500px, padding, border-radius
 *      var(--radius-full), border, box-shadow on focus.
 *    - .filters: flex, flex-wrap, gap, padding-y var(--space-lg).
 *    - .filter-pill: pill button, border, cursor, transition;
 *      .filter-pill.active: background var(--color-primary), white.
 *    - .events-grid: display grid, grid-auto (auto-fill), gap.
 * ============================================================
 */
