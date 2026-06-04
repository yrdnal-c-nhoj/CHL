# TODO

## Task: Move TSX files from `src/pages` to `src/components`

- [x] Inspect current imports/usages of the four files: `AllTagsPage.tsx`, `TagByImage.tsx`, `Tagger.tsx`, `TagManager.tsx`.
- [ ] Move those four files from `src/pages/` to `src/components/`.
- [ ] Update all import paths and React Router lazy imports in `src/App.tsx` to point to the new component locations.
- [ ] Update any relative imports inside the moved TSX files (they may reference `../styles/...`, `../context/...`, etc.).
- [ ] Run TypeScript build/tests (e.g. `npm test` or `npm run build`) to confirm everything compiles.
- [ ] Clean up any now-unused directories/files under `src/pages` if applicable (e.g. empty `src/pages` admin-related dirs).

