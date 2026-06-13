# Frontend Architecture

This document explains how the MediSync frontend is organized, how users move through the application, and where to make common changes safely.

## Purpose

The frontend is a React 18 + TypeScript progressive web application that presents emergency response, hospital coordination, staff management, and system monitoring views. It is built with Material UI, React Router, and a small set of context providers for authentication and theme management.

## Entry Points and Bootstrap Flow

The frontend boot sequence starts in `frontend/src/main.tsx`:

1. Import the root stylesheet in `index.css`.
2. Mount the React app into the `#root` element.
3. Render `App`.

`frontend/src/App.tsx` builds the application shell:

1. Wraps the app in `ColorModeProvider`.
2. Applies Material UI `CssBaseline`.
3. Creates a browser router from the shared `routes` definition.
4. Wraps route rendering in `AuthProvider` through the `AppRoot` outlet.
5. Registers a top-level `ErrorBoundary` for route failures.

This keeps app-wide concerns near the root and leaves page modules focused on feature logic.

## High-Level Directory Layout

`frontend/src/` is organized by responsibility:

- `assets/`
  Static images and logos used by the UI.
- `components/`
  Reusable layout, shared UI, loading, and error-handling building blocks.
- `context/`
  App-wide providers for authentication and color mode.
- `contexts/`
  Additional context modules. At the moment this folder mainly contains theme-related logic and overlaps in naming with `context/`.
- `pages/`
  Route-level screens and their local feature components.
- `routes/`
  Central route map and route-guard logic.
- `styles/`
  Shared stylesheet overrides such as Leaflet styling.
- `service-worker.ts` and `sw.ts`
  Progressive web app support files.
- `theme.ts`
  Shared theme configuration helpers.

## Routing Model

Routing is defined in `frontend/src/routes/index.tsx`.

### Public routes

- `/login`
- `/register`

These routes are wrapped in `PublicRoute`, which redirects authenticated users back to the main application.

### Protected routes

All main application routes are nested under `Layout` and guarded by `ProtectedRoute`. If the auth context is still loading, the router shows a centered spinner. If the user is not authenticated, navigation is redirected to `/login`.

### Primary application sections

- `/` -> Dashboard
- `/hospitals`
- `/emergencies`
- `/patients`
- `/staff`
- `/analytics`
- `/map`
- `/monitoring`
- `/support`
- `/settings`

Pages are loaded lazily with `React.lazy`, and `SuspenseWrapper` provides a consistent loading state while each page bundle is fetched.

## Layout and Navigation

`frontend/src/components/Layout/index.tsx` is the main authenticated shell.

Key responsibilities:

- Responsive drawer behavior for desktop and mobile
- Top app bar and account actions
- Navigation grouping by domain:
  - Main
  - Analytics
  - System
- Global search entry point
- Authentication-aware user menu

This component is the best place to update global navigation labels, section ordering, drawer behavior, or shell-level interactions.

## State and Context

### Authentication

`frontend/src/context/AuthContext.tsx` owns session state for the client.

Current behavior:

- Reads `user` and `token` from `localStorage`
- Exposes `login`, `logout`, `loading`, `error`, and `isAuthenticated`
- Uses mock user data for the current development flow

This is the main future integration point for backend-backed authentication.

### Color mode and theme

`frontend/src/context/ColorModeContext.tsx` manages:

- light/dark mode
- optional system-theme preference
- persistence to `localStorage`
- Material UI theme creation

The provider also centralizes palette, typography, elevation, drawer, and baseline styling rules.

## Feature Pages

The `pages/` folder contains route-level modules. Each top-level feature exports an `index.tsx` file that acts as the route entry.

### Core user-facing areas

- `Dashboard/`
  Main overview and key operational metrics
- `Hospitals/`
  Hospital discovery, cards, maps, detail views, filters, and add dialog
- `Emergencies/`
  Emergency case and protocol flows
- `Patients/`
  Patient-facing operations and supporting screens
- `Staff/`
  Staff management and availability views

### System and support areas

- `Analytics/`
  Reporting and trends
- `Map/`
  Geospatial and location-focused experience
- `Monitoring/`
  Operational health dashboards such as alerts, cluster status, logging, and performance
- `Support/`
  Support or help-oriented content
- `Settings/`
  User and system configuration

### Authentication area

- `Auth/Login.tsx`
- `Auth/Register.tsx`

These pages are the public entry for unauthenticated users.

## Shared UI Components

The reusable component layer is split into a few clear groups:

- `components/Layout/`
  App shell
- `components/common/`
  Small reusable UI primitives such as status badges, stat cards, and loading indicators
- `components/ErrorBoundary/`
  Route-safe error containment
- `components/GlobalSearch/`
  Shared search entry point
- `components/PWAUpdater/`
  Progressive web app update prompts
- `components/RouteTransition/`
  Transition wrapper for route changes

When a UI element is reused across multiple pages, it belongs in `components/`. If it is highly specific to one domain, it is better kept under that feature page folder.

## Progressive Web App Support

The frontend includes PWA-oriented files:

- `service-worker.ts`
- `sw.ts`

Combined with the package dependencies (`vite-plugin-pwa`, `workbox-*`), this suggests the app is designed for:

- installability
- offline support
- cached assets
- background update flows

Any future changes to offline behavior or caching policy should start with these files and the Vite/PWA configuration.

## Styling and Design System

Visual consistency is primarily driven by Material UI theme configuration in `ColorModeContext.tsx`, while `index.css`, `App.css`, and `styles/leaflet.css` provide lower-level or library-specific styling.

Practical rule of thumb:

- use the theme for colors, spacing, typography, and component tokens
- use page-local styles for feature layout needs
- use shared CSS files only for global resets or third-party integration quirks

## Notable Structural Observations

There are a few architectural details contributors should notice before making larger changes:

1. `context/` and `contexts/` both exist
   - This can be confusing for newcomers.
   - Future cleanup could consolidate naming once the maintainers are ready.
2. Authentication is currently mock-driven
   - UI flows are ready, but production auth wiring is still a backend integration task.
3. The route structure is already suitable for modular growth
   - Most new screens can be added by creating a page entry and updating `routes/index.tsx`.

## Common Change Scenarios

### Add a new protected page

1. Create a new folder in `frontend/src/pages/`.
2. Export the page from an `index.tsx`.
3. Add a lazy import in `frontend/src/routes/index.tsx`.
4. Register the new route under the protected `Layout` branch.
5. Add a navigation item in `components/Layout/index.tsx` if it should appear in the drawer.

### Update login behavior

1. Start in `frontend/src/context/AuthContext.tsx`.
2. Replace the mock user lookup with real API calls.
3. Keep `ProtectedRoute` and `PublicRoute` behavior aligned with the new session model.

### Change theme behavior

1. Update `frontend/src/context/ColorModeContext.tsx`.
2. Adjust palette, typography, or component overrides there first.
3. Only add CSS overrides when the theme cannot express the desired change cleanly.

## Recommended Next Documentation

This architecture overview is a map, not a full implementation spec. Good follow-up documents would be:

- data flow and API integration plan
- authentication lifecycle
- hospital dashboard component map
- monitoring page module responsibilities
