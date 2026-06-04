/**
 * ============================================================
 * FILE: frontend/src/pages/Dashboard.jsx
 * ============================================================
 * OWNER:        Team Member 2 (Frontend Developer — Auth & State)
 * TECHNOLOGIES: React 18, JSX, React Hooks (useState, useEffect),
 *               Recharts (or Chart.js via react-chartjs-2),
 *               Axios, AuthContext, CSS Grid (dashboard.css)
 *
 * INSTRUCTIONS FOR TEAM MEMBER 2:
 * ─────────────────────────────────────────────────────────────
 * This is the main protected analytics page visible to logged-in
 * users. It fetches analytics data from the Flask backend and
 * renders multiple interactive charts alongside stat cards.
 * Use the CSS Grid layout defined in dashboard.css.
 *
 * STEPS TO IMPLEMENT:
 *
 * 1. Imports:
 *    - Import React, { useState, useEffect } from 'react'.
 *    - Import { useNavigate } from 'react-router-dom'.
 *    - Import { useAuth } from '../context/AuthContext'.
 *    - Import dashboard stylesheet: import '../styles/dashboard.css'.
 *    - Import from Recharts:
 *        { ResponsiveContainer, LineChart, Line, BarChart, Bar,
 *          PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid,
 *          Tooltip, Legend }
 *    - Import axios.
 *
 * 2. Route Protection:
 *    - At the top of the component, extract user from context:
 *        const { user, token } = useAuth();
 *        const navigate = useNavigate();
 *    - Use a useEffect with [user, navigate] dependencies:
 *        If user is null (i.e., not logged in), call
 *        navigate('/login') to redirect unauthenticated access.
 *        (NOTE: a dedicated <ProtectedRoute> wrapper in App.jsx
 *        is the preferred pattern — implement both for defence
 *        in depth.)
 *
 * 3. State Variables:
 *    const [analyticsData, setAnalytics] = useState(null);
 *    const [sentimentData, setSentiment] = useState([]);
 *    const [bookingTrend, setBookingTrend] = useState([]);
 *    const [topEvents, setTopEvents]     = useState([]);
 *    const [isLoading, setIsLoading]     = useState(true);
 *
 * 4. useEffect — Data Fetching from Flask Analytics API:
 *    - On mount, fetch data from multiple Flask endpoints
 *      (or one aggregate endpoint), passing the JWT token:
 *        GET  /api/analytics/overview       → stat card numbers
 *        GET  /api/analytics/bookings-trend → time-series for LineChart
 *        GET  /api/analytics/sentiment      → sentiment for PieChart
 *        GET  /api/analytics/top-events     → top events for BarChart
 *    - Use Promise.all() to fetch all endpoints in parallel.
 *    - Set the respective state variables with the response data.
 *
 * 5. Stat Cards Data:
 *    - Use the analyticsData response to populate 4 stat cards:
 *        { label: 'Total Events',    value: analyticsData.totalEvents }
 *        { label: 'Total Bookings',  value: analyticsData.totalBookings }
 *        { label: 'Revenue (USD)',   value: `$${analyticsData.totalRevenue}` }
 *        { label: 'Avg Sentiment',   value: `${analyticsData.avgSentiment}%` }
 *
 * 6. JSX Structure to Build:
 *    <div className="dashboard-layout">
 *
 *      // Sidebar:
 *      <aside className="dashboard-sidebar">
 *        // Logo, navigation links: Dashboard, Events, Bookings, Analytics, Settings.
 *        // Highlight the active link using NavLink's isActive.
 *      </aside>
 *
 *      // Top Bar:
 *      <header className="dashboard-topbar">
 *        <h2>Analytics Dashboard</h2>
 *        <div> // User Avatar / Greeting: Hello, {user?.name} </div>
 *      </header>
 *
 *      // Main Content:
 *      <main className="dashboard-main">
 *
 *        // Stat Cards Grid:
 *        <div className="stat-cards-grid">
 *          {statCards.map(card => (
 *            <div key={card.label} className="stat-card">
 *              <span className="stat-card__value">{card.value}</span>
 *              <span className="stat-card__label">{card.label}</span>
 *            </div>
 *          ))}
 *        </div>
 *
 *        // Chart Section:
 *        <div className="chart-section">
 *
 *          // Booking Trend — Line Chart (2/3 width):
 *          <div className="chart-card">
 *            <div className="chart-card__header">
 *              <span className="chart-card__title">Booking Trends (Last 30 days)</span>
 *            </div>
 *            <div className="chart-wrapper">
 *              <ResponsiveContainer width="100%" height="100%">
 *                <LineChart data={bookingTrend}>
 *                  <CartesianGrid strokeDasharray="3 3" />
 *                  <XAxis dataKey="date" />
 *                  <YAxis />
 *                  <Tooltip />
 *                  <Line type="monotone" dataKey="bookings"
 *                        stroke="var(--color-primary)" strokeWidth={2} />
 *                </LineChart>
 *              </ResponsiveContainer>
 *            </div>
 *          </div>
 *
 *          // Sentiment Distribution — Pie Chart (1/3 width):
 *          <div className="chart-card">
 *            <div className="chart-card__header">
 *              <span className="chart-card__title">Review Sentiment</span>
 *            </div>
 *            <div className="chart-wrapper">
 *              <ResponsiveContainer width="100%" height="100%">
 *                <PieChart>
 *                  <Pie data={sentimentData} dataKey="value" nameKey="name"
 *                       cx="50%" cy="50%" outerRadius={80} label>
 *                    {sentimentData.map((entry, index) => (
 *                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
 *                    ))}
 *                  </Pie>
 *                  <Tooltip /> <Legend />
 *                </PieChart>
 *              </ResponsiveContainer>
 *            </div>
 *          </div>
 *
 *        </div>
 *
 *        // Top Events — Bar Chart (full width):
 *        <div className="chart-card">
 *          <div className="chart-card__header">
 *            <span className="chart-card__title">Top Events by Bookings</span>
 *          </div>
 *          <div className="chart-wrapper">
 *            <ResponsiveContainer width="100%" height="100%">
 *              <BarChart data={topEvents}>
 *                <CartesianGrid strokeDasharray="3 3" />
 *                <XAxis dataKey="title" />
 *                <YAxis />
 *                <Tooltip />
 *                <Bar dataKey="bookings" fill="var(--color-secondary)" />
 *              </BarChart>
 *            </ResponsiveContainer>
 *          </div>
 *        </div>
 *
 *      </main>
 *    </div>
 *
 * 7. Colour Constants for PieChart Cells:
 *    const COLORS = ['#22c55e', '#ef4444', '#f59e0b'];
 *    // These represent: Positive, Negative, Neutral sentiment.
 * ============================================================
 */
