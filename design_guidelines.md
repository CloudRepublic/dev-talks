# Design Guidelines: Dev Talks Podcast Browser

## Design Approach
**System Selected**: Spotify/Apple Podcasts-inspired with Linear's clean information architecture
**Rationale**: Utility-focused podcast browser requiring efficient content discovery, clear hierarchy, and familiar audio patterns

## Core Design Elements

### Typography
- **Primary Font**: Inter (Google Fonts) for clean, readable interface text
- **Accent Font**: Space Grono (Google Fonts) for podcast titles - gives technical/modern feel
- **Hierarchy**:
  - Hero/Page Title: text-4xl to text-5xl, font-bold
  - Episode Titles: text-xl, font-semibold
  - Episode Metadata: text-sm, reduced opacity
  - Body Text: text-base
  - Labels/UI: text-sm, font-medium

### Layout System
**Spacing Units**: Tailwind units of 3, 4, 6, 8, 12, 16
- Section padding: py-12 to py-16
- Card padding: p-6
- Component gaps: gap-4 to gap-6
- Element margins: mb-4, mb-6, mb-8

**Container Strategy**:
- Max-width: max-w-6xl for main content
- Full-width header/player bars
- Sidebar filters: w-64 on desktop, slide-over on mobile

### Component Library

**Header/Navigation**:
- Sticky header with podcast branding (logo/title)
- Theme toggle button (sun/moon icon) in top-right
- Search bar prominently placed in header (desktop) or below (mobile)
- Glass morphism effect with backdrop-blur

**Search & Filters**:
- Search input: Large, rounded-lg, with search icon prefix
- Keyword filter pills: Multi-select chips with active states, rounded-full
- Clear filters button when active
- Filter sidebar (desktop) or collapsible section (mobile)

**Episode Cards**:
- Card layout: Horizontal on desktop (image left, content right), vertical on mobile
- Episode artwork thumbnail (square, 96x96 on desktop, 64x64 on mobile)
- Title, description (truncated to 2-3 lines), date, duration
- Play button overlay on artwork
- Hover state: subtle elevation increase (shadow-md to shadow-lg)
- Border: border with rounded-xl

**Audio Player**:
- Fixed bottom player bar (sticky)
- Progress bar with scrubbing capability
- Play/pause, skip 15s back/forward controls
- Volume control (desktop only)
- Episode info display (current playing)
- Glass morphism with backdrop-blur-xl

**Empty States**:
- No results: Centered message with search/filter suggestions
- Loading: Skeleton cards with pulse animation

### Animations
- Theme toggle: Smooth 200ms transition on all elements
- Card hover: transform scale(1.01) with 150ms ease
- Player bar slide-up on episode play: 300ms ease-out
- Filter pill selection: Quick 100ms background transition
- Keep minimal - focus on responsiveness over flair

### Theme Implementation
**Light Theme**:
- Background: Subtle warm gray (bg-gray-50)
- Cards: White with soft shadow
- Text: Near-black with good contrast
- Accents: Brand blue for interactive elements

**Dark Theme**:
- Background: Deep charcoal (bg-gray-900)
- Cards: Elevated dark surface (bg-gray-800)
- Text: Off-white for reduced eye strain
- Accents: Lighter blue for better visibility

**Toggle Behavior**: Persist preference in localStorage, apply theme class to root element

### Responsive Breakpoints
- Mobile: Single column, full-width cards, collapsible filters
- Tablet (md:): 2-column grid for episodes, sidebar filters
- Desktop (lg:): Persistent sidebar, 2-3 column episode grid, enhanced player controls

### Icons
**Library**: Heroicons (CDN)
- Search, filter, play/pause, skip, volume, sun/moon, close, chevrons

### Images
**Episode Artwork**: Square thumbnails from RSS feed (image tag from each episode)
**Podcast Hero**: Optional small banner section with podcast cover art and description - keep compact (h-32 to h-48), not full hero treatment
**Placement**: Top of page, subtle background with podcast branding

### Key UX Patterns
- Instant search (filter as user types, debounced 300ms)
- Keyboard shortcuts: Space for play/pause, / for search focus
- Episode descriptions expand on click (read more)
- Visual feedback on all interactions
- Accessible focus states throughout