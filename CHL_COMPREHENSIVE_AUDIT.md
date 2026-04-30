# CHL Comprehensive Audit Report

**Project**: BorrowedTime @ Cubist Heart Laboratories  
**Audit Date**: April 30, 2026  
**Focus**: Performance, Delivery, Asset Utilization, Code Quality

---

## Executive Summary

| Metric | Value | Status |
|--------|-------|--------|
| Total Clocks | 65 active | ✅ Good |
| Font Files | 574 total / 304 used / 270 unused | 🔴 Critical |
| Image Files | 1,120 total / 885 used / 235 unused | 🟡 Warning |
| Image Storage | 215.10 MB total / 13.27 MB unused | 🟡 6.2% bloat |
| TypeScript Errors | 15+ | 🔴 Critical |
| Unused Dependencies | 6+ identified | 🟡 Warning |
| Empty/Corrupt Files | 2 found | 🔴 Fix Required |

**Overall Assessment**: The project has solid architecture but significant asset bloat and technical debt requiring immediate attention.

**Quick Links**:
- [AGENTS.md](../AGENTS.md) - Standards and CLI reference
- [README.md](../README.md) - Setup and development guide
- [src/templates/ARCHITECTURE.md](../src/templates/ARCHITECTURE.md) - Clock architecture guide

---

## 1. Asset Analysis

### 1.1 Fonts - CRITICAL ISSUE

**Statistics:**
- **Total fonts**: 574 files
- **Used fonts**: 304 files (53%)
- **Unused fonts**: 270 files (47%) 🔴
- **Non-standard fonts**: 33 files missing date prefix
- **Root folder strays**: 16 fonts in `src/assets/fonts/` (should be in `2025/` or `2026/`)

**Unused Font Storage Impact:**
- Estimated ~50-80MB of dead weight in repository
- Every unused font is bundled and deployed unnecessarily

**Key Finding**: Every clock appears to have both `.ttf` and `.woff2` versions, but only one format is typically used per clock. The `.woff2` versions are marked as unused in the audit, suggesting clocks import `.ttf` exclusively.

**Unused Font Examples (Top 20 by date):**
```
src/assets/fonts/2025/25-04-03-moby.woff2
src/assets/fonts/2025/25-04-06-conf.woff2
src/assets/fonts/2025/25-04-08-sage.woff2
... (270 total)
```

**Recommendations:**
1. **Immediate**: Run `npm run audit:fonts` and delete all 270 unused font files
2. **Policy**: Standardize on `.woff2` only (better compression, modern browser support)
3. **Naming**: Fix 33 non-standard font names with `npm run standardize:fonts`
4. **Process**: Add pre-commit hook to prevent unused asset commits

### 1.2 Images - MODERATE ISSUE

**Statistics:**
- **Total images**: 1,120 files
- **Used images**: 885 files (79%)
- **Unused images**: 235 files (21%)
- **Total storage**: 215.10 MB
- **Unused storage**: 13.27 MB (6.2%)

**Unused Image Categories:**

| Category | Count | Example |
|----------|-------|---------|
| Orphaned digit images (26-01-04) | ~180 | `digits/0/*.jpg`, `digits/1/*.webp` |
| Unreferenced backgrounds | 15 | `26-02-26/bg/*.jpg` |
| Development artifacts | 20 | `cocteau.webp`, `dragon1.mp4` |
| Duplicate/scratch files | 20 | Various test images |

**Critical Finding**: The `26-01-04` clock (Image-Based) has ~180 unused digit images - appears to be experimental/iteration files never cleaned up.

**Recommendations:**
1. Delete all 235 unused images (13.27 MB savings)
2. Move video files (`mp4`, `gif` > 100KB) to CDN
3. Implement image optimization pipeline (sharp-cli is already in package.json)
4. Standardize on WebP for all new images

### 1.3 GIFs Directory

- **Status**: Empty directory at `src/assets/gifs/`
- **Finding**: GIFs are being stored in `src/assets/images/` instead
- **Recommendation**: Remove empty directory or migrate GIFs to proper location

---

## 2. Code Quality Issues

### 2.1 TypeScript Errors - CRITICAL

Running `npm run type-check` reveals **15+ TypeScript errors**:

| File | Error | Severity |
|------|-------|----------|
| `assetLoader.ts:249` | RefObject null assignment | Medium |
| `assetLoader.ts:371` | RefObject null assignment | Medium |
| `assetLoader.ts:467` | String undefined type | Low |
| `dateUtils.ts:32` | Possibly undefined values | Medium |
| `dateUtils.ts:45` | Possibly undefined values | Medium |
| `useSmoothClock.ts:13` | Missing argument | High |
| `useSmoothClock.ts:46` | Missing argument | High |
| `latinNumberSpelling.ts:45-46` | String undefined type | Low |
| `performance.ts:79-80` | Missing arguments | High |
| `vite.config.ts:41` | Invalid esbuild config | Medium |

**Root Cause**: Recent TypeScript strict mode updates without corresponding code fixes.

### 2.2 Duplicate/Conflicting Files

**Found:**
- `useSmoothClock.ts` exists in both `src/utils/` and `src/utils/hooks/`
- `useClock.ts` exists in both locations
- Different implementations causing import confusion

**Imports from `@/utils/hooks`**: 16 files
**Imports from specific paths**: Mixed pattern

**Recommendation**: Consolidate all hooks into `src/utils/hooks/` and delete duplicates.

### 2.3 Empty/Corrupt Files

| File | Content | Action |
|------|---------|--------|
| `analytics.jsx` | Empty | Delete (use `analytics.ts`) |
| `Email.jsx` | "ff;" only | Delete (corrupted) |

---

## 3. Unused Dependencies Analysis

Reviewing `package.json` for dependencies that may be unused:

| Package | Likely Usage | Status |
|---------|--------------|--------|
| `@emailjs/browser` | Contact form | Verify |
| `cors` | Server-side? | 🔴 Unused in client build |
| `csv-parse` | Data import? | Verify |
| `dotenv` | Vite handles this | 🔴 Likely unused |
| `express` | Server | 🔴 Unused in client build |
| `form-data` | API calls? | Verify |
| `googleapis` | API integration | Verify |
| `mongodb` | Database | 🔴 Unused in client build |
| `papaparse` | CSV parsing | Verify |
| `puppeteer` | Screenshot scripts | ✅ Used in scripts/ |
| `twitter-api-v2` | Social? | 🔴 Check usage |

**DevDependencies to Review:**
- `styled-components` - Mixing with Tailwind? Check usage

---

## 4. Performance & Delivery Assessment

### 4.1 Current Build Configuration

**Vite Config Analysis (`vite.config.ts`):**

| Setting | Value | Assessment |
|---------|-------|------------|
| `assetsInlineLimit` | 4096 (4KB) | ✅ Good |
| `sourcemap` | `false` | ✅ Production-appropriate |
| `minify` | `esbuild` | ✅ Fast |
| `drop: ['console', 'debugger']` | Enabled | ✅ Clean builds |
| `manualChunks` | three, vendor, animation | ✅ Good splitting |
| Brotli/Gzip | Enabled | ✅ Compression |
| `chunkSizeWarningLimit` | 1000 (1MB) | 🟡 Could lower to 500KB |

**Issues Found:**
- `esbuild` config key is deprecated in Vite 7 (causes TS error)
- Should migrate to `build.rollupOptions` or `esbuild` in `optimizeDeps`

### 4.2 Font Loading Strategy

**Current**: `useSuspenseFontLoader` + dynamic injection
**Assessment**: ✅ Good - prevents FOUC

**Issue**: Multiple font formats (ttf + woff2) increase bundle size unnecessarily.

### 4.3 Image Loading Strategy

**Current**: Preloading via `useClockPage` hook
**Assessment**: ✅ Smart - preloads before showing clock

**Issue**: No lazy loading for below-fold images in Home/About pages.

### 4.4 Code Splitting

**Current**: Each clock is a separate chunk via `import.meta.glob`
**Assessment**: ✅ Excellent - Only loads current clock

**Bundle Sizes**: ~2-5kb per clock (as documented)

---

## 5. Documentation Review

### 5.1 Existing Documentation

| File | Status | Notes |
|------|--------|-------|
| `README.md` | ✅ Good | Clear setup, stack, architecture |
| `AGENTS.md` | ✅ Good | Standards for AI agents |
| `ProjectAudit.md` | 🟡 Duplicative | Overlaps with README, some redundancy |
| `LICENSE` | ✅ Present | MIT |
| `SECURITY.md` | ✅ Present | Standard template |

### 5.2 Documentation Gaps

1. **Deployment Process**: No documented deployment steps
2. **Asset Naming Convention**: In AGENTS.md but not enforced
3. **Clock Creation Workflow**: `clock:new` script exists but not documented in README
4. **Testing Strategy**: No docs on test patterns
5. **Performance Budgets**: No defined limits

### 5.3 Documentation Status

| Document | Status | Last Updated |
|----------|--------|--------------|
| README.md | ✅ Updated | April 30, 2026 |
| AGENTS.md | ✅ Updated | April 30, 2026 |
| ARCHITECTURE.md | ✅ Updated | April 30, 2026 |
| SECURITY.md | ✅ Current | - |
| LICENSE | ✅ Current | - |

### 5.4 AGENTS.md Accuracy

| Claim | Verified | Status |
|-------|----------|--------|
| Strict Typing (.tsx) | ✅ Mostly | Some .jsx files remain |
| CSS Modules for clocks | ✅ Yes | Correct |
| Tailwind for UI | ✅ Yes | Correct |
| `@/utils/hooks` pattern | 🟡 Partial | Duplicates exist |
| Font location `2025/` | ✅ Yes | Correct |

---

## 6. Architecture Strengths

### 6.1 Registry-Discovery Pattern
- `clockpages.json` as single source of truth
- `import.meta.glob` for automatic code splitting
- Clean, maintainable structure

### 6.2 Performance Optimizations
- Lazy loading with React Suspense
- Font preloading to prevent FOUC
- Image preloading before clock display
- Compression (Brotli + Gzip)

### 6.3 Standards Enforcement
- ESLint with strict React/TS rules
- Prettier formatting
- TypeScript strict mode (mostly)

---

## 7. Critical Recommendations (Priority Order)

### 🔴 P0 - Immediate (This Week)

1. **Delete 270 unused font files** (~50-80MB savings)
   ```bash
   # Use the audit report to create deletion script
   cat unused-fonts-report.txt | grep "^- " | sed 's/- //' | xargs rm
   ```

2. **Delete 235 unused images** (13.27 MB savings)

3. **Fix TypeScript errors** - 15+ blocking issues
   - Fix `useSmoothClock.ts` argument errors
   - Fix `vite.config.ts` esbuild deprecation
   - Fix RefObject null assignments

4. **Delete empty/corrupt files:**
   - `analytics.jsx`
   - `Email.jsx`

5. **Consolidate duplicate hooks**:
   - Move all to `src/utils/hooks/`
   - Delete `src/utils/useSmoothClock.ts`
   - Delete `src/utils/useClock.ts`

### 🟡 P1 - Short Term (Next 2 Weeks)

6. **Standardize on WOFF2 only** - Update all clocks to use `.woff2` instead of `.ttf`

7. **Fix non-standard font names**:
   ```bash
   npm run standardize:fonts
   ```

8. **Remove unused dependencies**:
   - `cors`, `express`, `mongodb`, `dotenv` (client-side)
   - Verify `twitter-api-v2`, `styled-components`

9. **Remove empty `gifs/` directory**

10. **Update Vite config** - Fix esbuild deprecation warning

### 🟢 P2 - Medium Term (Next Month)

11. **Implement automated asset auditing in CI**
    - Fail build if unused assets > 10%
    - Add to GitHub Actions workflow

12. **Image optimization pipeline**
    - Automate WebP conversion
    - Move videos to CDN

13. **Performance budgets**
    - Max 5MB per clock bundle
    - Max 100KB for fonts per clock
    - Document in AGENTS.md

14. **Documentation updates**
    - Document `clock:new` workflow
    - Add deployment guide
    - Add performance testing guide

---

## 8. Quick Wins Script

```bash
#!/bin/bash
# quick-cleanup.sh - Run after verifying reports

# 1. Remove unused fonts
echo "Removing unused fonts..."
while read -r line; do
  if [[ $line == "-"* ]]; then
    file="${line#- }"
    rm -f "$file" 2>/dev/null && echo "  Deleted: $file"
  fi
done < unused-fonts-report.txt

# 2. Remove unused images
echo "Removing unused images..."
while read -r line; do
  if [[ $line == "-"* ]]; then
    file="${line#- }"
    # Extract just the path (remove size suffix)
    filepath=$(echo "$file" | sed 's/ ([0-9.]* KB)//')
    rm -f "$filepath" 2>/dev/null && echo "  Deleted: $filepath"
  fi
done < unused-images-report.txt

# 3. Remove empty files
echo "Removing empty/corrupt files..."
rm -f src/analytics.jsx
rm -f src/Email.jsx

# 4. Remove empty directory
rmdir src/assets/gifs 2>/dev/null

echo "Cleanup complete!"
```

---

## 9. Appendix: File Structure Health

### 9.1 Directory Sizes (Estimated)

```
src/assets/fonts/     ~120MB (needs 47% reduction)
src/assets/images/    ~215MB (needs 6% reduction)  
src/pages/            ~2MB   (excellent - code splitting works)
src/components/       ~50KB  (good)
src/utils/            ~30KB  (good)
```

### 9.2 Code File Health

| Metric | Count |
|--------|-------|
| Total Clock Components | 65 |
| CSS Module Files | 59 |
| .tsx Files | ~300 |
| .jsx Files | ~20 (legacy - should migrate) |
| Test Files | Sparse coverage |

---

## 10. Conclusion

The BorrowedTime project demonstrates excellent architectural decisions with its Registry-Discovery pattern, code splitting, and performance-conscious loading strategies. However, **asset bloat has become a significant issue** with 47% of fonts and 21% of images being dead weight.

**Immediate action on P0 items will:**
- Reduce repository size by ~70MB
- Improve build times
- Reduce deployment bundle size
- Fix TypeScript strict mode compliance
- Clean up technical debt

**Estimated cleanup time: 2-4 hours**  
**Estimated impact: 30% smaller builds, faster CI/CD**

## A. Documentation Changelog

### April 30, 2026

**README.md**:
- Added comprehensive CLI script reference
- Added development workflow section
- Added deployment guide
- Added testing section with checklist

**AGENTS.md**:
- Added complete CLI command tables
- Added performance budgets section
- Added asset naming conventions
- Added troubleshooting section
- Added deployment checklist

**ARCHITECTURE.md**:
- Added complete hook API reference
- Added font loading deep dive
- Added common patterns section
- Added performance considerations
- Updated clock creation workflow

## B. Related Documentation

| Document | Purpose |
|----------|---------|
| [README.md](../README.md) | Setup, scripts, deployment |
| [AGENTS.md](../AGENTS.md) | Standards, CLI, troubleshooting |
| [ARCHITECTURE.md](../src/templates/ARCHITECTURE.md) | Clock component patterns |
| [SECURITY.md](../SECURITY.md) | Security policy |

---

*Audit generated by Cascade AI for Cubist Heart Laboratories*  
*For questions or clarifications, refer to AGENTS.md standards*
