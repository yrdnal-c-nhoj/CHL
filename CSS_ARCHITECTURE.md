# CSS Architecture Documentation

## Overview
This document outlines the CSS architecture strategy for the BorrowedTime project to ensure consistency, maintainability, and performance across all components.

## Current Architecture Strategy

### Hybrid Approach
We use a **hybrid CSS approach** optimized for different component types:

1. **CSS Modules** - Component-specific styles (navigation, layout)
2. **Tailwind CSS** - Content-heavy pages (About, Contact)  
3. **Inline Styles** - Unique clock designs (artistic freedom)

## Component Styling Patterns

### ✅ CSS Modules (Recommended for Reusable Components)
- **TopNav.jsx** → `TopNav.module.css`
- **Header.jsx** → `Header.module.css`
- **Home.tsx** → `Home.module.css`
- **ClockPage.tsx** → `ClockPage.module.css`

**When to use CSS Modules:**
- Reusable UI components
- Navigation elements
- Layout components
- When styles need component isolation

### ✅ Tailwind CSS (Recommended for Content Pages)
- **About.tsx** - Pure Tailwind classes
- **Contact.tsx** - Pure Tailwind classes

**When to use Tailwind:**
- Content-heavy pages
- Rapid prototyping
- Consistent design patterns
- Responsive layouts

### ✅ Inline Styles (Recommended for Unique Clocks)
- **50+ Clock components** - Individual artistic designs
- **ImageGrid.jsx** - Dynamic grid calculations

**When to use Inline Styles:**
- Unique, artistic clock designs
- Dynamic style calculations
- Component-specific animations
- When isolation is preferred

## Naming Conventions

### CSS Modules
- **CamelCase**: `.titleContainer`, `.navLink`, `.chlTitle`
- **Descriptive**: Clear purpose (`.navItem`, `.navMenu`)
- **Consistent**: Follow established patterns

### Tailwind Classes
- **Utility-first**: `flex`, `grid`, `text-center`
- **Responsive**: `lg:w-[70%]`, `max-w-[60ch]`
- **Custom**: `font-roboto`, `text-lab-red`

## File Organization

```
src/
├── components/
│   ├── TopNav.module.css      # Navigation styles
│   ├── Header.module.css      # Header styles  
│   ├── Footer.css           # Simple component
│   └── ImageGrid.css        # Grid component
├── pages/
│   └── [date]/Clock.module.css  # Individual clock styles
├── index.css                 # Global styles + Tailwind
└── tailwind.config.js        # Tailwind configuration
```

## Performance Considerations

### CSS Modules
- ✅ Scoped to component (no conflicts)
- ✅ Tree-shakeable by bundler
- ✅ Better maintainability

### Tailwind CSS
- ✅ JIT compilation (production optimized)
- ✅ Consistent design system
- ✅ Small bundle size

### Inline Styles
- ⚠️ Larger bundle size
- ✅ Maximum flexibility for clocks
- ✅ Dynamic calculations supported

## Development Guidelines

### 1. Choose the Right Approach
- **New Component**: Start with CSS modules
- **Content Page**: Use Tailwind classes
- **Clock Design**: Use inline styles

### 2. Follow Naming Patterns
- **CSS Modules**: camelCase, descriptive
- **Tailwind**: utility classes, responsive
- **Inline**: clear variable names

### 3. Maintain Consistency
- Similar components use same approach
- Document deviations from patterns
- Regular architecture reviews

## Migration Path

### Current State → Optimal State
1. ✅ **TopNav & Header**: Already CSS modules
2. ✅ **About & Contact**: Already Tailwind
3. ✅ **Clock pages**: Already inline (appropriate)
4. 🔄 **Footer**: Consider CSS modules
5. 🔄 **ImageGrid**: Consider more Tailwind

## Decision Tree

```
Component Type → Recommended Approach
├── Navigation → CSS Modules
├── Layout → CSS Modules  
├── Content → Tailwind CSS
├── Clock Art → Inline Styles
└── Simple UI → CSS Modules
```

## Best Practices

### CSS Modules
```css
/* Good */
.componentName {
  display: flex;
  align-items: center;
}

.componentName__element {
  color: var(--text-color);
}
```

### Tailwind CSS
```jsx
/* Good */
<div className="flex items-center justify-center p-4">
  <h1 className="text-2xl font-bold text-lab-red">
    Title
  </h1>
</div>
```

### Inline Styles
```jsx
/* Good for unique clocks */
const clockStyle = {
  position: 'absolute',
  fontSize: '4rem',
  color: dynamicColor,
};

<div style={clockStyle}>
  {/* Clock content */}
</div>
```

## Team Guidelines

1. **Document deviations** from this architecture
2. **Use consistent patterns** for similar components  
3. **Prefer established approaches** over new ones
4. **Regular architecture reviews** quarterly
5. **Update this document** when patterns change

---

*Last Updated: May 10, 2026*
*For questions about CSS architecture, contact the development team*
