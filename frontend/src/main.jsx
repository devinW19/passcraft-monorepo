/**
 * ============================================================
 * FILE: frontend/src/main.jsx
 * ============================================================
 * OWNER:        Team Member 1 (Frontend Developer)
 * TECHNOLOGIES: React 18, ReactDOM (createRoot API),
 *               Vite (module bundler / dev server),
 *               CSS3 (global stylesheet import)
 *
 * INSTRUCTIONS FOR TEAM MEMBER 1:
 * ─────────────────────────────────────────────────────────────
 * This is the application entry point executed by Vite. It
 * bootstraps React 18 using the new concurrent createRoot API
 * and mounts the entire component tree into the DOM. This file
 * should be kept minimal — it exists only to wire up React
 * to the HTML document.
 *
 * STEPS TO IMPLEMENT:
 *
 * 1. Imports:
 *    - Import React from 'react'.
 *      (Required for JSX transform in some configurations;
 *      with Vite + automatic JSX runtime, this may be optional.)
 *    - Import { StrictMode } from 'react'.
 *    - Import { createRoot } from 'react-dom/client'.
 *    - Import the root stylesheet: import './styles/global.css'.
 *      (This must be the FIRST style import to establish the
 *      design system baseline before component styles load.)
 *    - Import the root component: import App from './App'.
 *
 * 2. Root Element Selection:
 *    - Select the DOM mount point created in index.html:
 *        const rootElement = document.getElementById('root');
 *    - Add a null check guard:
 *        if (!rootElement) {
 *          throw new Error('Root element #root not found in index.html.');
 *        }
 *
 * 3. React 18 Concurrent Root Creation:
 *    - Use the new createRoot API (NOT the legacy ReactDOM.render):
 *        const root = createRoot(rootElement);
 *    - The createRoot API enables React 18's concurrent features
 *      such as automatic batching, Suspense improvements, and
 *      the useTransition / useDeferredValue hooks.
 *
 * 4. Render the Application Tree:
 *    - Call root.render() wrapping App in React.StrictMode:
 *        root.render(
 *          <StrictMode>
 *            <App />
 *          </StrictMode>
 *        );
 *    - StrictMode intentionally double-invokes certain lifecycle
 *      methods and renders in development to surface side effects
 *      and deprecated API usage. Remove it ONLY if a third-party
 *      library is incompatible with it (document that decision).
 *
 * 5. Do NOT:
 *    - Add any application logic, routing, context providers, or
 *      state management here. Those all live in App.jsx and its
 *      children.
 *    - Import ReactDOM.render() — it is deprecated in React 18
 *      and will display a console warning.
 * ============================================================
 */
