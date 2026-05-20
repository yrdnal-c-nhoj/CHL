# 🚀 Quick Start: Creating a New Clock

Follow this guide to build a new component that meets the **BorrowedTime Standard (BTS)** on the first attempt.

---

## 1. Generation
Run the automated generator to scaffold the directory structure and initial files.

```bash
npm run clock:new
```
*This creates:*
- `src/pages/YYYY/YY-MM/YY-MM-DD/Clock.tsx`
- `src/pages/YYYY/YY-MM/YY-MM-DD/Clock.module.css`
- Asset folders in `src/assets/images/YY-MM/YY-MM-DD/`

---

## 2. Choose Your Template
Choose the template that best fits your artistic direction. Copy the contents into your new `Clock.tsx`.

| Template | Use Case | Link |
| :--- | :--- | :--- |
| **Base Clock** | Standard React + CSS Modules. Best for clean, 2D layouts. | View Template |
| **Three.js / Fiber** | 3D Scenes, Shaders, and complex geometries. | View Template |
| **Canvas / SVG** | High-performance 2D procedural art or vector paths. | View Template |

---

## 3. Development Standards (The BTS Checklist)
To ensure your component passes the `finalize` script, verify these four pillars during development:

### 🕒 Time Handling
Use the custom hooks to keep time in sync with the global app state.
- Use `useClockTime()` for standard updates.
- Use `useSmoothClock()` for high-refresh animations (60fps).

### 🔤 Asset Loading
Prevent "Flash of Unstyled Content" (FOUC) and layout shifts.
- **Fonts**: Must use `useSuspenseFontLoader()`.
- **Images/Video**: Use `useMultiAssetLoader()` for pre-fetching.

### 🏗️ Semantic Markup
Every clock must be accessible and machine-readable.
- Wrap the main display in a `<main>` or `<article>` tag.
- Use the `<time>` element: `<time dateTime={isoString}>{displayTime}</time>`.

### 🎨 Isolation
- All styles **must** reside in `Clock.module.css`. 
- Avoid global selectors; use the `:local` scope provided by CSS Modules.

---

## 4. Registration
Your clock will not appear in the application until it is registered in the central registry.

1. Open `src/context/clockpages.json`.
2. Add your new entry at the bottom of the list:
```json
{
  "date": "26-05-15",
  "title": "Your Clock Title",
  "description": "Brief artistic description.",
  "path": "/26-05-15"
}
```

---

## 5. Finalization (The Quality Gate)
Before committing, run the finalization suite. This script will auto-fix pathing, rename assets to standard conventions, and capture the required thumbnails.

```bash
npm run finalize
```

**Success Criteria:** If the console shows `✅ Component is ready for GitHub!`, you are finished.