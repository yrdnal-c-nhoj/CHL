# TODO — Harden the Clock Standards Audit Tooling

Goal: Make the verifier a reliable source of truth and enforce it in CI.

## Steps
- [ ] Create shared fix module `scripts/clock-fixes.mjs` (reusable codemods for each boilerplate rule)
- [ ] `verify-clock.js`: add `root-main` as a **required** rule; implement `--fix` for `assets`, `<time>`+`srOnly`, `React.memo`+`displayName`, `<main>` root, and srOnly CSS
- [ ] `verify-all-clocks.js`: move `root-not-main` from PROHIBITED into RULES (required); add `--fix` mode; add `--max-total`/`--max-critical` regression guards
- [ ] Create baseline `clocks-standards.json` (current violation counts)
- [ ] Add npm scripts (`verify:clocks`, `verify:clocks:fix`)
- [ ] Wire audit into CI: GitHub Actions workflow that fails if compliance regresses vs baseline
- [ ] Verify: run `node scripts/verify-clock.js ... --fix` and `node scripts/verify-all-clocks.js --quiet`
