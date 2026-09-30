# BorrowedTime Operations

Last reviewed: 2026-09-29

## Canonical Delivery

The production site is served from the Vercel deployment for the repository. Keep one canonical production deployment path; legacy deployment configurations should be removed or explicitly documented if they remain necessary.

### Deployment configuration files

| File | Status |
|---|---|
| `vercel.json` | **Production.** Build, SPA fallback, and cache headers. |
| `netlify.toml`, `public/_headers` | Not used by production. Legacy Netlify configuration; remove or document a reason to keep. |
| `Dockerfile`, `nginx.conf` | Not used by production. Self-hosting option only; `nginx.conf` sets no cache headers, so it does not implement the policy in `docs/PERFORMANCE.md`. |

When you change caching or routing, change `vercel.json` and update `docs/PERFORMANCE.md` in the same commit.

## Local Verification

Before a production release, run what CI runs, in this order:

```bash
npm ci
npm run verify:clocks:changed
npm run test:run
npm run type-check
npm run build
```

Do not gate a release on `npm run lint` or `npm run check`: they lint the whole legacy fleet, which has known failures (`docs/STATUS.md`). Lint only what you changed (`AGENTS.md`, Validation).

For clock changes, also visually smoke-test the affected route.

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

Verify the deployed headers directly (replace `<hash-file>` with any file name from the page's network tab):

```bash
curl -sI https://<production-host>/            | grep -i cache-control   # expect: no-cache
curl -sI https://<production-host>/assets/<hash-file> | grep -i cache-control   # expect: immutable
```

If the second command shows `no-cache`, the catch-all rule in `vercel.json` is overriding the assets rule. Narrowing it to exclude assets (for example `"source": "/((?!assets/).*)"`) is the usual fix, but test it on a preview deployment first.

## Repository and Build Growth

Track both Git repository size and production build size. The daily archive is expected to grow.

Do not delete artwork simply to reduce size. When growth becomes materially limiting, evaluate:

1. Git LFS for binary history;
2. external object storage/CDN for older media;
3. archival/static builds for historical years;
4. separation of active application code from historical delivery.

Make this an explicit architectural decision before storage or deployment limits become the emergency driver.

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
