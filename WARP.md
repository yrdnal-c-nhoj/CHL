# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Commands

### Prerequisites
- Node.js >= 18 (see `package.json` `engines.node`).
- Use `npm` for scripts; there is no yarn/pnpm lockfile.

### Install dependencies
```bash
npm install
```

### Run the dev server
Starts the Vite dev server on the default port (usually 5173).
```bash
npm run dev
```

### Build for production
Outputs a static site to `dist/` using Vite.
```bash
npm run build
```

### Preview the production build
Serves the built `dist` output locally via Vite.
```bash
npm run preview
```

### Data source selection
`DataContext` chooses between the main and test clock datasets based on `VITE_ENVIRONMENT`:
```bash
# Use main clock data (default)
npm run dev

# Use testclock.json instead of clockpages.json
VITE_ENVIRONMENT=testing npm run dev
```

### Tests and linting
- There are **no test or lint scripts** defined in `package.json` as of this version of the repo.
- An `eslint.config.js` file exists but is actually a React clock component (`Clockgrid`), not a real ESLint configuration.

If you add tests or a linter in the future, prefer to expose them via `package.json` scripts so they can be run via `npm test`, `npm run lint`, etc.

### Other scripts
`package.json` defines a `screenshot` script:
```bash
npm run screenshot
```
However, the referenced `screenshot.js` file is currently missing; running this script will fail until that file is added.

---

## High-level architecture

This is a Vite + React single-page application for **BorrowedTime**, a daily clock site by Cubist Heart Laboratories. The core idea is:
- A JSON data source describes each day's clock (date, path, title).
- Each clock is implemented as its own React component under `src/pages/<yy-mm-dd>/Clock.jsx` with colocated assets.
- The router loads the appropriate clock dynamically based on the URL.

At a high level, there are three layers:
- **Shell / routing** – `main.jsx`, `App.jsx`, and high-level layout components.
- **Data layer** – `DataContext` and JSON clock metadata.
- **Per-day clock implementations** – independent React components under `src/pages/**/Clock.jsx` plus their local assets.

### Entry point and shell
- `src/main.jsx` is the React entry point. It:
  - Imports global styles from `src/index.css`.
  - Wraps the app in `React.StrictMode` and `HelmetProvider` (`react-helmet-async`).
  - Renders the root `App` component into `#root`.

- `src/App.jsx` is the main application shell. It:
  - Wraps everything in `DataProvider` (see **Data and configuration**).
  - Uses `BrowserRouter` from `react-router-dom` with routes:
    - `/` → `Home`
    - `/:date` → `ClockPage` (dynamic clock pages)
    - `/about` → `About`
    - `/manifesto` → `Manifesto`
    - `/contact` → `Contact`
    - `/today` → `Today` (auto-selects a clock for "today" or the latest available)
    - `/index.html` and any unknown path redirect back to `/`.
  - Defines `AnalyticsAndSEO`, which:
    - Reads the current location.
    - Computes a dynamic `<title>` and `<meta>` description based on whether the route looks like a clock path (`/yy-mm-dd`) or a generic page.
    - Calls `pageview(path + location.search)` from `src/analytics.jsx` on route changes.
    - Injects SEO and Open Graph tags via `Helmet`.

### Data and configuration

Clock metadata is centralized in `src/context`:
- `src/context/clockpages.json` – primary list of clocks (used by default).
- `src/context/testclock.json` – alternative test dataset with the same structure.

`src/context/DataContext.jsx`:
- Exposes `DataContext` and `DataProvider`.
- Selects the data source based on `import.meta.env.VITE_ENVIRONMENT`:
  - `'testing'` → `testclock.json`.
  - Anything else (or undefined) → `clockpages.json`.
- Normalizes each row into an `item` object with:
  - `path` – cleaned folder path like `25-04-02` (falls back to `date` if `path` is missing).
  - `date` – string in `yy-mm-dd` format.
  - `title` – title with the word `clock` removed (case-insensitive) and trimmed; defaults to `"No Title"`.
  - `clockNumber` – 1‑based index in the list.
- Filters out any entries that:
  - Lack a `path`, or
  - Have a `date` not matching `^\d{2}-\d{2}-\d{2}$`.
- Provides `{ items, loading, error }` to the rest of the app.

### Clock pages (per-day clocks)

Per‑day clock implementations live under `src/pages`:
- Directory naming convention: `src/pages/<yy-mm-dd>/`.
- Each directory contains a `Clock.jsx` plus any fonts (`.ttf`, `.otf`, etc.), images (`.gif`, `.webp`, `.jpg`, `.png`), and styles it needs.
- The binding between JSON data and the physical folder is via the `path` field in `clockpages.json` / `testclock.json`.
- Individual clocks are free-form React components and may use any of the visual / animation libraries declared in `package.json` (e.g., `three` / `@react-three/fiber` / `@react-three/drei`, `gsap`, `styled-components`, Tailwind via PostCSS).

#### Dynamic loading via `ClockPage`

`src/ClockPage.jsx` handles the `/:date` route for arbitrary clock dates:
- Uses `useParams` to read `date` (expected format `yy-mm-dd`).
- Uses `DataContext` to access `items` and match the requested `date` against the normalized `items.date`.
- Rejects invalid formats (anything not `\d{2}-\d{2}-\d{2}`) by redirecting to `/`.
- If no matching item is found, also redirects back to `/`.

To load the actual clock component:
- Uses Vite's `import.meta.glob('./pages/**/Clock.jsx')` to build a map of all `Clock.jsx` modules.
- Constructs a key like `./pages/${item.path}/Clock.jsx` and dynamically imports that module.
- Once loaded, it stores the default export as `ClockComponent` in state, and renders it inside a font‑isolated wrapper:
  - A `div` with `all: 'initial'` and `fontFamily: 'CustomFont, system-ui, sans-serif'`.

UX details handled by `ClockPage`:
- Locks scrolling by setting `document.body.style.overflow = 'hidden'` while mounted.
- Shows a top `Header` that fades out after 1.5 seconds (controlled by `headerOpacity`).
- Shows a full‑screen black overlay that quickly fades away when the clock is ready.
- Renders `ClockPageNav` at the bottom with previous / current / next links based on the `items` ordering.

#### Dynamic "today" page

`src/Today.jsx` renders a clock for "today" (or the most recent available):
- Uses `DataContext` to get `items`.
- Computes today's date in `yy-mm-dd` form, then tries to find a matching `item` by date.
- If no exact match exists, it falls back to the last clock in chronological order.
- Dynamically loads the `Clock.jsx` for that `item` using the same `import.meta.glob('./pages/**/Clock.jsx')` approach.
- Manages its own header and footer visibility:
  - Header fades out after 1.5 seconds.
  - Footer (`ClockPageNav`) auto‑hides after a short period of inactivity and reappears on mouse/touch.
- Prevents page scrolling while mounted by locking `document.body.style.overflow`.
- Formats the "today" date for display as `MM/DD/YY` instead of the `yy-mm-dd` route format.

### Home and static content pages

#### Home page (index)

`src/Home.jsx` implements the main index of clocks:
- Uses `TopNav` and `Footer` for global navigation and branding.
- Reads `items` from `DataContext`.
- Waits for custom fonts to load via `document.fonts.ready`, storing a `fontsLoaded` flag in `sessionStorage` to avoid repeated waits.
- Persists sort preferences in `localStorage` under `sortBy`.
- Validates and formats dates for display (shown as `yy.mm.dd`).
- Provides multiple sort modes via buttons:
  - Date ascending / descending.
  - Title ascending / descending.
  - Random order.
- Renders a list of entries; each entry links to `/${item.date}` using `react-router-dom` `Link`.
- Shows Instagram and X icons linking to the lab's social accounts in the lower right.

#### Word-based pages

Static text pages share a common "word page" layout:
- `src/Contact.jsx`
- `src/About.jsx`
- `src/Manifesto.jsx`

Typical structure:
- Wrap content in a `div.container` with `TopNav` at the top and `Footer` at the bottom.
- Use shared styles from `src/WordPages.css` (note that `Manifesto.jsx` currently comments this import out and still relies on `container`/`centeredContent` being globally defined).

Notable integrations:
- `Contact.jsx`:
  - Social links for Instagram and X with small icon images from `src/assets`.
  - A Buttondown email newsletter subscription form posting to `https://buttondown.email/api/emails/embed-subscribe/borrowed`.
  - A `mailto:` link to `cubistheart@gmail.com` with a subject containing emojis.
- `About.jsx`:
  - Static copy describing BorrowedTime and Cubist Heart Laboratories.
- `Manifesto.jsx`:
  - A manifesto page with multiple sections; uses custom CSS classes like `hat`, `smallcaps`, `line`, `translate`.

### Layout, navigation, and chrome

Key shared components in `src/components`:
- `TopNav.jsx`:
  - Renders the site brand (Cubist Heart Laboratories / BorrowedTime) and tagline.
  - Implements a hamburger‑style mobile nav that toggles visibility of the menu.
  - Uses `NavLink` for routing to `"/"`, `"/contact"`, and `"/today"`.
  - Links to `"/about"` and `"/manifesto"` are present but currently commented out.
- `Header.jsx`:
  - Displays a transient title overlay (`🧊🫀🔭` and "BorrowedTime") on clock pages.
  - Visibility is driven by the `visible` prop and associated CSS classes.
- `ClockPageNav.jsx`:
  - Shows a footer navigation strip on clock and today pages.
  - Computes visibility based on mouse / touch activity; hides again after a short idle period.
  - Provides three clickable areas:
    - Previous clock (or home if there is no previous).
    - Center section linking to home, showing date, title, and clock number.
    - Next clock (or home if there is no next).
- `Footer.jsx`:
  - Simple site footer showing the current year and Cubist Heart Laboratories logo/emojis.

`src/layout.jsx`:
- Despite the name, this is not a layout root but a standalone experimental `ClockNumbers` component displaying hours 0–24.
- It is not wired into the router as of now.

### Analytics

- `src/analytics.jsx` defines a single `pageview(url)` helper.
- It assumes a global `window.gtag` function is available and calls:
  - `window.gtag('config', 'G-24VJ4G2H48', { page_path: url })`.
- `App.jsx`'s `AnalyticsAndSEO` component invokes `pageview` whenever the route changes (`useLocation` + `useEffect`).
- For analytics to work correctly in production, ensure that the Google Analytics tag (for measurement ID `G-24VJ4G2H48`) is loaded in the HTML template or via your deployment platform.

### Forms and external services

#### EmailJS contact form

- `src/ContactForm.jsx` (currently not wired into `Contact.jsx`) sets up an EmailJS form using:
  - `emailjs.sendForm('service_22mck9l', 'template_q5d1j6q', form.current, '8pV1DN6kZkdOvnJom')`.
- The service ID, template ID, and public key are hard‑coded in this file.
- If you change these values in your EmailJS dashboard, update them here or move them into environment variables / configuration before using this form in production.

#### Newsletter subscription

- `Contact.jsx` embeds a Buttondown newsletter form, POSTing directly to Buttondown.
- The form uses a simple email field and a submit button; Buttondown handles the rest.

### Build and asset pipeline

`vite.config.js` customizes how assets are built:
- `base: './'` – the app is built with a relative base so it can be served from nested paths (important when clock pages are accessed via generated static HTML paths).
- `plugins: [react()]` – standard Vite React plugin.
- `css.postcss: './postcss.config.js'` – Vite is configured to look for `postcss.config.js`.
  - **Note:** The actual PostCSS config file in this repo is `postcss.config.cjs`, not `postcss.config.js`. If you modify Tailwind/PostCSS, keep this mismatch in mind; you may want to align the filename and the Vite config.
- `assetsInclude: ['**/*.otf', '**/*.ttf', '**/*.woff2']` so font files are treated as assets.
- Custom `build.rollupOptions.output` to:
  - Place fonts under `assets/fonts/[name]-[hash][extname]`.
  - Place other static assets under `assets/[name]-[hash][extname]`.
  - Place JS output under `assets/js/`.

`postcss.config.cjs`:
- Uses `@tailwindcss/postcss` and `autoprefixer`.
- Tailwind CSS 4 is included as a dev dependency; its usage is driven via PostCSS rather than a traditional `tailwind.config.js` for now.

### Notable quirks and gotchas

- **ESLint config name collision:** `eslint.config.js` is actually a `Clockgrid` React component, not a real ESLint configuration file. Do not treat it as linter config; if you introduce ESLint later, use a different filename or relocate this component.
- **PostCSS config path mismatch:** Vite expects `./postcss.config.js` but the repo currently has `postcss.config.cjs`. If CSS processing behaves unexpectedly, check that configuration first.
- **Route date format:** Many parts of the app assume dates are strings in the `yy-mm-dd` format (e.g., `25-04-02`). When adding new entries to `clockpages.json` / `testclock.json` or new folders to `src/pages`, keep this format consistent.
- **Data source switching:** `DataContext`'s behavior depends on `VITE_ENVIRONMENT`; make sure you set it intentionally when running in non-default modes.
- **Scroll locking:** Both `ClockPage` and `Today` manually set `document.body.style.overflow = 'hidden'` on mount. If you add new overlays or modals around these pages, be aware of this interaction.
