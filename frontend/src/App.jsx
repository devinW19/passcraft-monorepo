/**
 * ============================================================
 * FILE: frontend/src/App.jsx
 * ============================================================
 * OWNER:        Team Member 2 (Frontend Developer — Auth & State)
 * TECHNOLOGIES: React 18, JSX, React Router v6
 *               (BrowserRouter, Routes, Route, Navigate),
 *               AuthContext (useAuth)
 *
 * INSTRUCTIONS FOR TEAM MEMBER 2:
 * ─────────────────────────────────────────────────────────────
 * This is the root application component. Its sole responsibility
 * is to define the client-side routing table via React Router v6
 * and guard protected routes. All page components are lazy-loaded
 * for code-splitting. AuthProvider (from AuthContext) must wrap
 * all routes so any descendant component can consume auth state.
 *
 * STEPS TO IMPLEMENT:
 *
 * 1. Imports:
 *    - Import React, { lazy, Suspense } from 'react'.
 *    - Import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'.
 *    - Import { AuthProvider, useAuth } from './context/AuthContext'.
 *    - Lazy-import all page components:
 *        const Home      = lazy(() => import('./pages/Home'));
 *        const Login     = lazy(() => import('./pages/Login'));
 *        const Register  = lazy(() => import('./pages/Register'));
 *        const Dashboard = lazy(() => import('./pages/Dashboard'));
 *        const EventDetail = lazy(() => import('./pages/EventDetail'));
 *        const NotFound  = lazy(() => import('./pages/NotFound'));
 *
 * 2. ProtectedRoute Helper Component:
 *    - Define a small inline component:
 *        function ProtectedRoute({ children }) {
 *          const { user, isLoading } = useAuth();
 *          if (isLoading) return <div>Loading...</div>;
 *          return user ? children : <Navigate to="/login" replace />;
 *        }
 *    - This component wraps any Route that requires authentication.
 *      If the user is null, it redirects them to /login using
 *      Navigate (which replaces the history entry).
 *
 * 3. PublicOnlyRoute Helper Component (optional but recommended):
 *    - Define a helper that redirects already-authenticated users
 *      away from Login/Register pages:
 *        function PublicOnlyRoute({ children }) {
 *          const { user } = useAuth();
 *          return user ? <Navigate to="/dashboard" replace /> : children;
 *        }
 *
 * 4. Loading Fallback (Suspense):
 *    - Create a <LoadingFallback /> component (a centered spinner
 *      or skeleton) to display while lazy-loaded chunks are fetching.
 *
 * 5. App Component Return JSX:
 *    export default function App() {
 *      return (
 *        <BrowserRouter>
 *          <AuthProvider>
 *            <Suspense fallback={<LoadingFallback />}>
 *              <Routes>
 *
 *                // Public Routes:
 *                <Route path="/" element={<Home />} />
 *                <Route path="/events/:id" element={<EventDetail />} />
 *
 *                // Public-Only Routes (redirect if logged in):
 *                <Route path="/login" element={
 *                  <PublicOnlyRoute><Login /></PublicOnlyRoute>
 *                } />
 *                <Route path="/register" element={
 *                  <PublicOnlyRoute><Register /></PublicOnlyRoute>
 *                } />
 *
 *                // Protected Routes (redirect if NOT logged in):
 *                <Route path="/dashboard" element={
 *                  <ProtectedRoute><Dashboard /></ProtectedRoute>
 *                } />
 *
 *                // 404 Catch-all:
 *                <Route path="*" element={<NotFound />} />
 *
 *              </Routes>
 *            </Suspense>
 *          </AuthProvider>
 *        </BrowserRouter>
 *      );
 *    }
 *
 * 6. Important Notes:
 *    - BrowserRouter must be the outermost wrapper.
 *    - AuthProvider must be INSIDE BrowserRouter so that
 *      context hooks (like useNavigate inside AuthContext's
 *      logout) work correctly.
 *    - Add additional Route entries as new pages are created
 *      (e.g., /bookings, /profile, /admin).
 * ============================================================
 */
