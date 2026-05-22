# TODO (GitHub repo cleanup)

## Step 1: Confirm current repo state
- [x] Run `git status` (working tree clean)

## Step 2: Identify tracked junk
- [x] List tracked `.env*`, `.DS_Store`, and `dist/` using `git ls-files | grep -E '(\.DS_Store|dist/|node_modules/|\.env)'`

## Step 3: Update `.gitignore`
- [ ] Add ignores for `node_modules/`, `dist/`, `*.log`, `.DS_Store`, and `.env*` (keep `.env.example`)

## Step 4: Untrack already-committed junk (without deleting locally)
- [ ] Run `git rm -r --cached dist .DS_Store .env.* node_modules` (only if those paths are tracked)

## Step 5: Commit cleanup
- [ ] `git add -A && git commit -m "chore: clean up tracked generated/secret files"`

## Step 6: Verify
- [ ] Re-run `git ls-files | grep -E '(\.DS_Store|dist/|node_modules/|\.env)'` to ensure none remain tracked
- [ ] Run `git status` to confirm clean working tree

