/**
 * ============================================================
 * FILE: frontend/src/components/Navbar.jsx
 * ============================================================
 * OWNER:        Team Member 1 (Frontend Developer)
 * TECHNOLOGIES: React 18, JSX, CSS3, React Router v6,
 *               React Context API (AuthContext)
 *
 * INSTRUCTIONS FOR TEAM MEMBER 1:
 * ─────────────────────────────────────────────────────────────
 * Build a fully responsive navigation header that conditionally
 * renders links based on the authenticated user's state, sourced
 * from AuthContext. It must collapse into a hamburger menu on
 * mobile viewports.
 *
 * STEPS TO IMPLEMENT:
 *
 * 1. Imports:
 *    - Import React, { useState } from 'react'.
 *    - Import { Link, NavLink, useNavigate } from 'react-router-dom'.
 *    - Import { useAuth } from '../context/AuthContext'.
 *    - Import logo asset: import Logo from '../../assets/logo.svg'.
 *    - Import a Navbar-specific CSS module or inline scoped styles.
 *
 * 2. Component Definition:
 *    - Export a default functional component: `export default function Navbar() {}`
 *
 * 3. State & Context:
 *    - Call `const { user, logout } = useAuth()` to access
 *      auth state from the global context.
 *    - Call `const [menuOpen, setMenuOpen] = useState(false)` to
 *      manage the mobile hamburger menu toggle state.
 *    - Call `const navigate = useNavigate()` for programmatic
 *      navigation after logout.
 *
 * 4. Logout Handler:
 *    - Define `const handleLogout = () => { logout(); navigate('/login'); }`.
 *      This calls the context logout function (which clears JWT
 *      from localStorage) and then redirects to the Login page.
 *
 * 5. JSX Structure to Build:
 *    <header className="navbar">
 *      <div className="navbar__brand">
 *        <Link to="/"> <img src={Logo} alt="PassCraft" /> </Link>
 *      </div>
 *
 *      // Hamburger Toggle Button (visible on mobile only):
 *      <button className="navbar__toggle" onClick={() => setMenuOpen(!menuOpen)}
 *              aria-label="Toggle navigation">
 *        // Render three span bars OR a hamburger/X icon based on menuOpen state.
 *      </button>
 *
 *      <nav className={`navbar__links ${menuOpen ? 'navbar__links--open' : ''}`}>
 *        // Public links (always visible):
 *        <NavLink to="/" className={({ isActive }) => isActive ? 'active' : ''}>Home</NavLink>
 *        <NavLink to="/events">Events</NavLink>
 *
 *        // Conditional links — only render when user IS authenticated:
 *        {user && (
 *          <>
 *            <NavLink to="/dashboard">Dashboard</NavLink>
 *            <NavLink to="/bookings">My Bookings</NavLink>
 *          </>
 *        )}
 *
 *        // Auth state buttons:
 *        {user ? (
 *          <button className="btn btn-outline" onClick={handleLogout}>Logout</button>
 *        ) : (
 *          <>
 *            <Link to="/login" className="btn btn-outline">Login</Link>
 *            <Link to="/register" className="btn btn-primary">Sign Up</Link>
 *          </>
 *        )}
 *      </nav>
 *    </header>
 *
 * 6. CSS Classes to Style (in global.css or a Navbar.css module):
 *    - .navbar: fixed top, full-width, flex, justify-between,
 *      align-center, z-index 100, backdrop-filter blur,
 *      background rgba with transparency.
 *    - .navbar__links: flex row gap on desktop; flex column
 *      on mobile when --open modifier is applied.
 *    - .navbar__toggle: hidden on desktop, visible on mobile.
 *    - .active NavLink style: color var(--color-primary),
 *      font-weight 600, underline indicator.
 *
 * 7. Accessibility:
 *    - Add aria-expanded={menuOpen} on the toggle button.
 *    - Add role="navigation" on <nav>.
 *    - Ensure all interactive elements are keyboard-focusable.
 * ============================================================
 */
