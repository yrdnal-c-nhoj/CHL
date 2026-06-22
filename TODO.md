- [ ] Review current environment-based JSON selection logic in src/context/DataContext.tsx
- [x] Change DataContext to always default to clockpages.json in non-test builds
- [x] Only load testclocks.json when explicitly enabled (VITE_USE_TEST_DATA === 'true') or (MODE === 'test')
- [x] Add lightweight runtime logging in dev/test to confirm which JSON is loaded

- [ ] Run unit tests / build (npm run test, npm run build) to ensure nothing breaks

