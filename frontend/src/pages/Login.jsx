/**
 * ============================================================
 * FILE: frontend/src/pages/Login.jsx
 * ============================================================
 * OWNER:        Team Member 2 (Frontend Developer — Auth & State)
 * TECHNOLOGIES: React 18, JSX, React Hooks (useState),
 *               React Router v6, AuthContext, CSS3 Forms
 *
 * INSTRUCTIONS FOR TEAM MEMBER 2:
 * ─────────────────────────────────────────────────────────────
 * This page renders the user login form with controlled inputs.
 * On successful authentication it redirects to the Dashboard.
 * On failure it displays an inline error message. All auth
 * logic is delegated to AuthContext — do NOT call the API
 * directly from this component.
 *
 * STEPS TO IMPLEMENT:
 *
 * 1. Imports:
 *    - Import React, { useState } from 'react'.
 *    - Import { Link, useNavigate } from 'react-router-dom'.
 *    - Import { useAuth } from '../context/AuthContext'.
 *
 * 2. State Variables:
 *    const [email, setEmail]       = useState('');
 *    const [password, setPassword] = useState('');
 *    const [error, setError]       = useState('');
 *    const [isSubmitting, setIsSubmitting] = useState(false);
 *
 * 3. Context & Navigation:
 *    const { login } = useAuth();
 *    const navigate = useNavigate();
 *
 * 4. Form Submission Handler:
 *    - `const handleSubmit = async (e) => { ... }`
 *    - Call e.preventDefault() to block native form submission.
 *    - Validate that both email and password fields are non-empty.
 *      If empty, setError('Please fill in all fields.') and return.
 *    - Validate email format using a simple regex or HTML5
 *      input type="email" validation.
 *    - setIsSubmitting(true); setError('');
 *    - Wrap in try/catch:
 *        try {
 *          await login(email, password);
 *          navigate('/dashboard');  // redirect on success
 *        } catch (err) {
 *          setError(err.response?.data?.message || 'Login failed. Check credentials.');
 *        } finally {
 *          setIsSubmitting(false);
 *        }
 *
 * 5. JSX Structure to Build:
 *    <div className="auth-page">
 *      <div className="auth-card">
 *
 *        // Logo / Branding:
 *        <div className="auth-card__header">
 *          <img src="/logo.svg" alt="PassCraft" className="auth-logo" />
 *          <h1 className="auth-card__title">Welcome Back</h1>
 *          <p className="auth-card__subtitle">Log in to your PassCraft account</p>
 *        </div>
 *
 *        // Error Banner (only render when error state is non-empty):
 *        {error && <div className="alert alert--error">{error}</div>}
 *
 *        // Login Form:
 *        <form onSubmit={handleSubmit} className="auth-form" noValidate>
 *
 *          // Email Field:
 *          <div className="form-group">
 *            <label htmlFor="login-email">Email Address</label>
 *            <input
 *              id="login-email"
 *              type="email"
 *              value={email}
 *              onChange={(e) => setEmail(e.target.value)}
 *              placeholder="you@example.com"
 *              autoComplete="email"
 *              required
 *            />
 *          </div>
 *
 *          // Password Field:
 *          <div className="form-group">
 *            <label htmlFor="login-password">Password</label>
 *            <div className="input-with-icon">
 *              <input
 *                id="login-password"
 *                type="password"
 *                value={password}
 *                onChange={(e) => setPassword(e.target.value)}
 *                placeholder="Enter your password"
 *                autoComplete="current-password"
 *                required
 *              />
 *              // Optional: add a toggle button to show/hide password.
 *            </div>
 *          </div>
 *
 *          // Forgot Password Link:
 *          <Link to="/forgot-password" className="auth-form__forgot">
 *            Forgot your password?
 *          </Link>
 *
 *          // Submit Button:
 *          <button
 *            type="submit"
 *            className="btn btn-primary auth-form__submit"
 *            disabled={isSubmitting}
 *          >
 *            {isSubmitting ? 'Logging in...' : 'Log In'}
 *          </button>
 *
 *        </form>
 *
 *        // Register Link:
 *        <p className="auth-card__footer">
 *          Don't have an account? <Link to="/register">Sign Up</Link>
 *        </p>
 *
 *      </div>
 *    </div>
 *
 * 6. CSS Classes (in global.css or Login.css):
 *    - .auth-page: full viewport height, flex center both axes,
 *      background gradient using --color-primary.
 *    - .auth-card: background var(--color-surface), max-width 440px,
 *      width 100%, border-radius var(--radius-lg), padding var(--space-2xl),
 *      box-shadow var(--shadow-lg).
 *    - .form-group: flex-column, gap var(--space-xs), margin-bottom.
 *    - label: font-weight 600, text-sm, color var(--color-text).
 *    - input: full-width, padding, border 1px solid var(--color-border),
 *      border-radius, focus outline var(--color-primary).
 *    - .alert--error: background danger-tinted, border-left danger,
 *      padding, border-radius, text-sm.
 * ============================================================
 */
