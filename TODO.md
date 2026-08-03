# TODO - React 19 Migration

## Steps

- [ ] Upgrade `react`/`react-dom` to ^19.2.8, `@types/react`/`@types/react-dom` to ^19.2.x
- [ ] Upgrade `@react-three/fiber` ^9.7.0 and `@react-three/drei` ^10.7.7 (peer deps for React 19)
- [ ] Remove deprecated `react-helmet-async`; replace with native React 19 metadata
- [ ] Update `src/main.tsx` (remove HelmetProvider)
- [ ] Update `src/App.tsx` (Helmet → native title/meta)
- [ ] Update `src/test/App.test.tsx` (remove Helmet mock)
- [ ] Fix any @react-three/fiber 8→9 API breakage in 3D clock pages
- [ ] Run `tsc --noEmit`, `npm run lint`, `npm run build`, and tests
