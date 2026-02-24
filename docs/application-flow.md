# Application Flow - MCI Analytics

This document describes the high-level application flow and architecture of the MCI Analytics platform.

## 1. Authentication Flow
- The application uses **NextAuth.js** for authentication.
- Upon accessing protected routes, users are redirected to the login page (`/app/login`).
- After successful authentication, a session is established and made available via `SessionProvider` in `app/providers.tsx`.
- Middleware (`middleware.ts`) ensures that only authenticated users can access specific parts of the application.

## 2. Dashboard Initialization (SSR)
- The main dashboard (`app/page.tsx`) is a Server Component.
- It calculates initial date ranges (e.g., last 7 days for demography, last 7 months for NCD data) using utility functions.
- These initial states are passed to the `StoreInitializer` component.
- **StoreInitializer** populates the **Zustand** store on the client side with this initial data, ensuring that both Server and Client have a synchronized starting state.

## 3. Component Hierarchy & Layout
- The `RootLayout` (`app/layout.tsx`) wraps the entire application.
- It includes global components like `Navbar` and `Footer`.
- The `Providers` component wraps the application with `QueryClientProvider` (for React Query) and `SessionProvider` (for NextAuth).

## 4. Data Fetching Strategy
- **Initial Load**: Handled via Server Components or initial props passed to the store.
- **Dynamic Updates**:
  - Client-side data fetching is managed by **React Query**.
  - Components use custom hooks (defined in `utils/hooks`) to fetch data from API routes (`/app/api`).
  - These API routes interact with various backends: **Prisma** (Postgres/MySQL), **ElasticSearch**, and **Cassandra**.

## 5. Main Feature Areas
- **SHR Dashboard**: The primary analytics view showing HID registrations, platform stats, and demographic data.
- **Search NID**: Feature to search for patient records using NID.
- **NCD Corner**: Dedicated section for Non-Communicable Diseases analytics.
- **Admin Panel**: Management interface for application administrators.

## 6. Data Management
- **Zustand** handles the UI state (filters, dates, active view).
- **React Query** handles the server data state (caching, loading states, re-fetching on filter changes).
- Data is often converted from various backend formats to FHIR-compliant structures before being displayed.
