# Dev Talks Podcast Browser

## Overview

This is a podcast browser application for "Dev Talks," a software development podcast by Cloud Republic. The application fetches and displays podcast episodes from an RSS feed, allowing users to search, filter by keywords, and play episodes directly in the browser. The interface is inspired by Spotify/Apple Podcasts with a clean, utility-focused design emphasizing efficient content discovery.

**Core Functionality:**
- Browse podcast episodes fetched from Buzzsprout RSS feed
- Search episodes by title and description
- Filter episodes by technical keywords (AI, Cloud, DevOps, Python, etc.)
- Play audio episodes with full playback controls
- Track played/unplayed episodes (stored in browser localStorage)
- Pagination for episode lists
- Dark/light theme support

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework:** React 18 with TypeScript, built using Vite as the build tool and development server.

**Routing:** Wouter is used for client-side routing, though the application currently implements a single-page architecture with just the podcast browsing page.

**State Management:**
- TanStack Query (React Query) handles server state and API data fetching with automatic caching and background updates
- Local React state (useState/useContext) manages UI state like search queries, filters, and pagination
- localStorage persists user preferences (theme, played episodes) across sessions

**UI Component Library:** shadcn/ui components built on Radix UI primitives, providing accessible, unstyled component primitives that are styled with Tailwind CSS. This approach ensures consistency while maintaining full design control.

**Styling System:**
- Tailwind CSS for utility-first styling with custom design tokens
- CSS variables for theming (light/dark mode)
- Custom fonts: Inter for UI text, Space Grotesk for podcast titles
- Design follows Spotify/Linear-inspired patterns with emphasis on clean information hierarchy

**Key Design Decisions:**
- Component-based architecture with clear separation between presentational and container components
- Custom hooks (usePlayedEpisodes, useTheme, useIsMobile) encapsulate reusable logic
- Framer Motion provides smooth animations for interactive elements
- Responsive design with mobile-first approach

### Backend Architecture

**Server Framework:** Express.js running on Node.js, serving both the API and static frontend assets.

**API Design:** RESTful endpoint structure with a single primary endpoint `/api/podcast` that fetches and transforms RSS feed data.

**RSS Feed Processing:**
- Uses `rss-parser` library to fetch and parse the Buzzsprout RSS feed
- Transforms RSS XML into structured JSON format
- Extracts episode metadata including title, description, publish date, duration, audio URL, and images
- Server acts as a proxy to avoid CORS issues with direct feed access

**Development vs Production:**
- Development: Vite dev server with HMR (Hot Module Replacement) for fast iteration
- Production: Static files served from `dist/public` directory
- Custom Vite middleware integration for seamless development experience

**Build Process:**
- Frontend: Vite bundles React application into optimized static assets
- Backend: esbuild compiles TypeScript server code into ESM format
- Single build command produces both client and server distributions

### Data Layer

**Database:** Drizzle ORM is configured with PostgreSQL support, though currently unused. The configuration exists for future expansion (user accounts, saved episodes, etc.).

**Current Data Sources:**
- RSS Feed: Primary data source (https://rss.buzzsprout.com/793019.rss)
- localStorage: Client-side storage for user preferences and played episode tracking

**Schema Design (Shared):**
- Zod schemas define TypeScript types and runtime validation
- `episodeSchema` and `podcastFeedSchema` ensure type safety between client and server
- Enables sharing type definitions across the full stack

**Why No Database Currently:**
The application is intentionally stateless on the server side, requiring no user authentication or persistent server-side data. All personalization happens client-side, making the app simpler to deploy and maintain while keeping costs low.

### External Dependencies

**Third-Party Services:**
- **Buzzsprout RSS Feed:** Primary content source providing podcast episodes and metadata
- **Google Fonts:** Delivers Inter and Space Grotesk typefaces for consistent typography

**Key npm Packages:**
- **React Ecosystem:** react, react-dom, @tanstack/react-query for UI and state management
- **UI Components:** @radix-ui/* packages provide accessible primitives; shadcn/ui provides styled implementations
- **Styling:** tailwindcss, class-variance-authority (CVA), clsx for dynamic className handling
- **Forms & Validation:** react-hook-form, @hookform/resolvers, zod for type-safe form handling
- **Utilities:** date-fns for date formatting, nanoid for unique ID generation
- **Backend:** express for server, rss-parser for feed processing
- **Database (configured, not used):** drizzle-orm, @neondatabase/serverless, connect-pg-simple
- **Development:** vite, @vitejs/plugin-react, tsx for TypeScript execution, esbuild for production builds
- **Replit Integration:** @replit/vite-plugin-* packages for enhanced Replit development experience

**Media Playback:**
Native HTML5 `<audio>` element with custom React controls, no external player library required.

**Animation:**
- **framer-motion:** Provides smooth transitions and animations for interactive elements
- **embla-carousel-react:** Carousel functionality (available but not actively used in current implementation)