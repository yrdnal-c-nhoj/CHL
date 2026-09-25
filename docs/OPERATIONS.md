# BorrowedTime Operations

Last reviewed: 2026-09-25

## Canonical Delivery

The production site is served from the Vercel deployment for the repository. Keep one canonical production deployment path; legacy deployment configurations should be removed or explicitly documented if they remain necessary.

Vercel is the production source of truth for deployment behavior. A deployment that succeeds locally but fails on Vercel is not considered production-ready until the Vercel build succeeds.

## Local Verification

Before a production release:

```bash
npm ci
npm run type-check
npm run lint
npm run test:run
npm run build
```

For clock changes, also run `npm run verify:clocks:changed` and visually smoke-test the affected route.

## Deployment Checks

After deployment, verify:

- the home route;
- `/today`;
- a current date route;
- a representative historical date route;
- fonts and media load;
- no unexpected console errors;
- the current clock displays the correct time.

## Caching

Hashed Vite assets should be cacheable for a long period with immutable caching. HTML/app-shell responses should remain revalidatable so a new daily route becomes visible without stale shell content.

Cache rules must not accidentally apply immutable caching to unhashed HTML.

## Repository and Build Growth

Track both Git repository size and production build size. The daily archive is expected to grow.

Do not delete artwork simply to reduce size. When growth becomes materially limiting, evaluate:

1. Git LFS for binary history;
2. external object storage/CDN for older media;
3. archival/static builds for historical years;
4. separation of active application code from historical delivery.

Make this an explicit architectural decision before storage or deployment limits become the emergency driver.

## Git LFS

Binary assets tracked by Git LFS must have both the repository pointer and the corresponding LFS object available before pushing.

When Git reports `GH008` or an unknown LFS object:

1. Do not rewrite repository history immediately.
2. Identify the missing object.
3. Check whether it exists locally.
4. Fetch the required LFS object from the remote when available.
5. Verify the working-tree asset before retrying the push.
6. Treat unrelated LFS discrepancies as separate from application or documentation changes.

Do not use history-rewriting or bulk LFS migration commands as routine fixes.

## Incident Triage

When a clock breaks in production:

1. Identify the affected date route.
2. Check browser console and network failures.
3. Check whether the asset/font/media import is present.
4. Compare against the last known working deployment.
5. Fix the smallest relevant change.
6. Re-run the relevant verifier and production build.
7. Deploy and verify the affected route.

Avoid rewriting a historical artwork when a routing, asset, or shared-infrastructure fix is sufficient.
