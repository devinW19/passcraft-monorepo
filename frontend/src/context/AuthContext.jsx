/**
 * ============================================================
 * FILE: frontend/src/context/AuthContext.jsx
 * ============================================================
 * OWNER:        Team Member 2 (Frontend Developer — Auth & State)
 * TECHNOLOGIES: React 18, React Context API, React Hooks
 *               (useState, useEffect, useContext, createContext),
 *               localStorage Web API, JWT (JSON Web Token)
 *
 * INSTRUCTIONS FOR TEAM MEMBER 2:
 * ─────────────────────────────────────────────────────────────
 * This file implements the global authentication state manager
 * for the PassCraft frontend using React's Context API. It
 * exposes a Provider component that wraps the entire app tree
 * (in main.jsx) and a custom hook (useAuth) for consuming
 * auth state from any nested component.
 *
 * STEPS TO IMPLEMENT:
 *
 * 1. Imports:
 *    - Import React, { createContext, useContext, useState,
 *      useEffect } from 'react'.
 *    - Import axios (or use the native Fetch API) for making
 *      HTTP requests to the Node.js backend auth endpoints.
 *
 * 2. Create the Context Object:
 *    - `const AuthContext = createContext(null);`
 *    - This creates the context "channel" through which state
 *      flows from Provider down to all child consumers.
 *
 * 3. AuthProvider Component:
 *    - Export a named functional component:
 *        `export function AuthProvider({ children }) {}`
 *    - Internal State:
 *        const [user, setUser] = useState(null);
 *        const [token, setToken] = useState(null);
 *        const [isLoading, setIsLoading] = useState(true);
 *        (isLoading starts true while we check localStorage on mount)
 *
 *    - useEffect (on mount — persistence check):
 *        On component mount, read 'passcraft_token' and
 *        'passcraft_user' from localStorage. If they exist,
 *        parse the user JSON and hydrate `user` and `token`
 *        states, effectively restoring session across page refreshes.
 *        Set isLoading to false after this check completes.
 *
 * 4. Login Function:
 *    - `const login = async (email, password) => { ... }`
 *    - Make a POST request to the Node.js backend:
 *        POST /api/auth/login  with body { email, password }.
 *    - On success, the response will contain { token, user }.
 *    - Persist both to localStorage:
 *        localStorage.setItem('passcraft_token', token)
 *        localStorage.setItem('passcraft_user', JSON.stringify(user))
 *    - Update React state: setUser(user), setToken(token).
 *    - Return the response or throw an error on failure so the
 *      Login.jsx form can catch and display the error message.
 *
 * 5. Register Function:
 *    - `const register = async (name, email, password) => { ... }`
 *    - Make a POST request to: POST /api/auth/register.
 *    - On success, automatically log the user in by calling
 *      the login() function, or redirect to the Login page.
 *
 * 6. Logout Function:
 *    - `const logout = () => { ... }`
 *    - Clear localStorage: remove 'passcraft_token' and
 *      'passcraft_user'.
 *    - Reset state: setUser(null), setToken(null).
 *
 * 7. Axios Default Header (optional but recommended):
 *    - Use a useEffect that watches `token` state changes.
 *    - When token is set: axios.defaults.headers.common
 *      ['Authorization'] = `Bearer ${token}`;
 *    - When token is null: delete axios.defaults.headers
 *      .common['Authorization'];
 *    - This globally attaches the JWT to every subsequent
 *      axios request, so individual components don't need to
 *      manually attach auth headers.
 *
 * 8. Context Value Object:
 *    - The Provider's value prop must expose:
 *        { user, token, isLoading, login, register, logout }
 *
 * 9. Return JSX:
 *    - `return <AuthContext.Provider value={contextValue}>
 *               {children}
 *             </AuthContext.Provider>;`
 *
 * 10. Custom Hook (useAuth):
 *     - Export a named custom hook:
 *         `export const useAuth = () => {`
 *         `  const context = useContext(AuthContext);`
 *         `  if (!context) {`
 *         `    throw new Error('useAuth must be used within AuthProvider');`
 *         `  }`
 *         `  return context;`
 *         `};`
 *     - This hook is what every other component (Navbar, Dashboard,
 *       ProtectedRoute, etc.) imports to access auth state.
 * ============================================================
 */
