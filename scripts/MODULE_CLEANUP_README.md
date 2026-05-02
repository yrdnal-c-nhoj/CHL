# CHL Module Cleanup Script

## Overview

The `module-cleanup.mjs` script automatically cleans up all clock modules according to BorrowedTime Standards (BTS). It eliminates errors, aligns code with standards, and optimizes for performance.

## Usage

```bash
npm run cleanup:modules
```

## What It Does

### 1. **Import Organization**
- Sorts imports according to BTS standards
- Groups imports by source (react, hooks, assets, etc.)
- Ensures proper import order

### 2. **Forbidden Pattern Elimination**
- Replaces `document.querySelector` with `useRef` comments
- Replaces `console.log` with proper logging comments
- Converts `any` types to `unknown`
- Converts `setInterval` to `useClockTime` hook usage

### 3. **Required Pattern Enforcement**
- Ensures `useSuspenseFontLoader` is present and used
- Adds `fontConfigs` definition if missing
- Ensures proper `<time dateTime={...}>` elements
- Validates React hooks usage

### 4. **Performance Optimization**
- Identifies functions exceeding 50 lines
- Adds TODO comments for refactoring large functions
- Ensures proper cleanup in useEffect hooks

### 5. **TypeScript Issue Resolution**
- Fixes common React.FC usage patterns
- Adds proper event handler types
- Optimizes React hooks imports
- Ensures proper typing throughout

### 6. **React Pattern Compliance**
- Converts `React.useEffect` to `useEffect`
- Converts `React.useState` to `useState`
- Ensures proper cleanup functions
- Validates memo usage patterns

## BTS Standards Enforced

### Import Order
1. React imports
2. `@/utils/hooks`
3. `@/utils/fontLoader`
4. `@/utils/clockUtils`
5. `@/assets/images`
6. `@/assets/fonts`
7. `@/types`
8. `./Clock.module.css`
9. `@/components`
10. Other imports

### Forbidden Patterns
- `document.querySelector`
- `document.getElementById`
- `setInterval(`
- `setTimeout(`
- `any` types
- `@ts-ignore`
- `console.log/warn/error`

### Required Patterns
- `useSuspenseFontLoader`
- `useRef` for DOM access
- `useEffect` with cleanup
- `<time dateTime={...}>` for time displays
- `fontConfigs` definition

### Performance Limits
- Maximum 50 lines per function
- Maximum 500 lines per file
- Proper cleanup in all effects

## Output

The script provides:
- Real-time progress updates
- Count of issues fixed per module
- Overall statistics summary
- Final validation (TypeScript, ESLint, Build)

## Example Output

```
🧹 Starting CHL Module Cleanup...

📁 Found 67 clock modules

🔧 Processing: src/pages/2025/25-04/25-04-01/Clock.tsx
  ✅ Fixed 5 issues

🔧 Processing: src/pages/2025/25-04/25-04-02/Clock.tsx
  ✅ Already compliant

...

🔍 Running final validation...

📋 TypeScript check:
  ✅ TypeScript check passed

📋 ESLint check:
  ⚠️  ESLint issues remain (manual review needed)

📋 Build test:
  ✅ Build successful

============================================================
🎉 CHL Module Cleanup Complete!
============================================================
📊 Modules processed: 67
🔧 Issues fixed: 234
⚡ Performance optimizations: 12
📁 Modules with issues: 45

✨ All modules are now aligned with BorrowedTime Standards!
```

## Manual Follow-up Required

After running the script, some issues may require manual attention:

1. **Large Functions**: Functions marked with `// TODO: Refactor large function` need manual splitting
2. **TypeScript Issues**: Complex type issues may need manual resolution
3. **Performance**: Review and optimize identified performance bottlenecks
4. **Testing**: Test affected modules to ensure functionality is preserved

## Integration with CI/CD

Add to your CI pipeline:

```yaml
- name: Run Module Cleanup
  run: npm run cleanup:modules
```

## Safety Features

- **Backup**: The script modifies files in place
- **Validation**: Runs TypeScript, ESLint, and build checks
- **Reporting**: Detailed statistics and progress tracking
- **Rollback**: Use git to revert if needed

## Troubleshooting

### Script Fails
- Check Node.js version (requires 24.x)
- Ensure all dependencies are installed
- Verify file permissions

### Build Issues After Cleanup
- Review TypeScript errors manually
- Check for missing imports
- Validate React component structure

### Performance Issues
- Review identified large functions
- Consider code splitting
- Optimize asset loading

## Best Practices

1. **Run Before Major Changes**: Clean up before adding new features
2. **Review Changes**: Check git diff before committing
3. **Test Thoroughly**: Ensure all clocks still function
4. **Iterative Approach**: Address remaining issues gradually
5. **Documentation**: Update docs for any architectural changes

## Related Scripts

- `npm run standardize:fonts` - Font naming compliance
- `npm run audit:images` - Image usage audit
- `npm run audit:fonts` - Font compliance check
- `npm run lint` --fix - Auto-fix lint issues
- `npm run format` - Code formatting
