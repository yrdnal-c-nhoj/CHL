# Project AI Instructions

## Required reading

Before planning or editing any task, read
[`docs/AI_DEVELOPMENT_GUIDE.md`](docs/AI_DEVELOPMENT_GUIDE.md). It is the
repository-wide playbook for importing images, media, and fonts, building
clocks, tiling images, registering assets, and validating changes.

Also read the linked `CLOCK_STANDARDS.md` and `PERFORMANCE.md` sections when
the task touches clocks, assets, fonts, media, loading, or bundle size.

Framework:
- React
- TypeScript
- Vite

Rules:
- Do not use Tailwind.
- Prefer CSS Modules for static styles; use inline styles only for genuinely
  dynamic values such as computed transforms or asset CSS variables.
- Do not use px for layout.
- Prefer dvh, vh, vw, rem, %, and fr.
- Components must be responsive.
- Never introduce scrolling unless explicitly requested.
- Preserve existing image/font imports.
- Do not rename assets.
- Do not modify unrelated clock components.
- Use existing project utilities/hooks where appropriate.
- Keep components self-contained when practical.
- Check TypeScript errors.
- Run npm run build before declaring the task complete.

When modifying a clock:
1. Read `docs/AI_DEVELOPMENT_GUIDE.md` and `docs/CLOCK_STANDARDS.md`.
2. Inspect the existing component and its module CSS.
3. Understand its current visual behavior and asset loading.
4. Make the smallest necessary changes.
5. Register every imported image, font, and media file in `assets`.
6. Check for TypeScript errors and run the target clock verifier.
7. Run the Vite build.
8. Fix build errors.
9. Report exactly what was changed and which checks ran.
