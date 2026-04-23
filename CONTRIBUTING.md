# Contributing to BorrowedTime

Thank you for your interest in contributing to BorrowedTime! This document provides guidelines and instructions for contributing to this creative digital art project.

## 🎯 Ways to Contribute

### 1. Add a New Clock

The primary way to contribute is by creating a new daily clock:

- Create a clock following our [date-based structure](README.md#creating-a-new-clock)
- Test on multiple browsers and devices
- Follow the existing code style and patterns
- Submit a pull request

### 2. Improve Existing Clocks

- Fix bugs in existing clock implementations
- Improve performance or accessibility
- Enhance animations or visual effects
- Refactor for better code quality

### 3. Enhance Infrastructure

- Improve build tools and configuration
- Add new testing coverage
- Optimize asset loading
- Improve development experience

## 🚀 Getting Started

1. **Fork the repository**

   ```bash
   git clone https://github.com/yrdnal-c-nhoj/CHL.git
   cd CHL
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment**

   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Start development server**

   ```bash
   npm run dev
   ```

## 📝 Guidelines

### Code Style

- Use TypeScript for new components
- Follow existing file naming conventions
- Use CSS Modules for component styles (`.module.css`)
- Run `npm run lint` before committing
- Run `npm run format` to format code

### Clock Structure

Each clock should be in:

```text
src/pages/YYYY/YY-MM/YY-MM-DD/
├── Clock.tsx           # Main clock component
├── Clock.module.css    # Scoped styles
└── assets/             # Clock-specific images/fonts (optional)
```

### Testing

- Run `npm run test:run` to ensure tests pass
- Add tests for new utilities or components
- Follow existing test patterns in `src/test/`


### How to use it:

1.  **Run the audit script first**: This ensures you have an up-to-date list of unused fonts.
    ```bash
    node scripts/audit-fonts.mjs
    ```
    This will generate or update `unused-fonts-report.txt`.

2.  **Run the deletion script**:
    ```bash
    node scripts/delete-unused-fonts.mjs
    ```
    The script will list all the font files it intends to delete and ask for your confirmation before proceeding.

This approach provides a safe way to remove unused fonts, giving you a chance to review the list before any files are permanently deleted.

<!--
[PROMPT_SUGGESTION]Can you add a `npm run clean:fonts` script to package.json that runs both the audit and delete scripts?[/PROMPT_SUGGESTION]
[PROMPT_SUGGESTION]The audit script currently marks a font as "used" if it's imported, even if not actively applied. How can I modify the audit script to only consider fonts "used" if they are actually passed to `useSuspenseFontLoader` or `useMultipleFontLoader`?[/PROMPT_SUGGESTION]
-->

### How to use it:

1.  **Run the audit script first**: This ensures you have an up-to-date list of unused fonts.
    ```bash
    node scripts/audit-fonts.mjs
    ```
    This will generate or update `unused-fonts-report.txt`.

2.  **Run the deletion script**:
    ```bash
    node scripts/delete-unused-fonts.mjs
    ```
    The script will list all the font files it intends to delete and ask for your confirmation before proceeding.

This approach provides a safe way to remove unused fonts, giving you a chance to review the list before any files are permanently deleted.

<!--
[PROMPT_SUGGESTION]Can you add a `npm run clean:fonts` script to package.json that runs both the audit and delete scripts?[/PROMPT_SUGGESTION]
[PROMPT_SUGGESTION]The audit script currently marks a font as "used" if it's imported, even if not actively applied. How can I modify the audit script to only consider fonts "used" if they are actually passed to `useSuspenseFontLoader` or `useMultipleFontLoader`?[/PROMPT_SUGGESTION]
-->

### How to use it:

1.  **Run the audit script first**: This ensures you have an up-to-date list of unused fonts.
    ```bash
    node scripts/audit-fonts.mjs
    ```
    This will generate or update `unused-fonts-report.txt`.

2.  **Run the deletion script**:
    ```bash
    node scripts/delete-unused-fonts.mjs
    ```
    The script will list all the font files it intends to delete and ask for your confirmation before proceeding.

This approach provides a safe way to remove unused fonts, giving you a chance to review the list before any files are permanently deleted.

<!--
[PROMPT_SUGGESTION]Can you add a `npm run clean:fonts` script to package.json that runs both the audit and delete scripts?[/PROMPT_SUGGESTION]
[PROMPT_SUGGESTION]The audit script currently marks a font as "used" if it's imported, even if not actively applied. How can I modify the audit script to only consider fonts "used" if they are actually passed to `useSuspenseFontLoader` or `useMultipleFontLoader`?[/PROMPT_SUGGESTION]
-->

### How to use it:

1.  **Run the audit script first**: This ensures you have an up-to-date list of unused fonts.
    ```bash
    node scripts/audit-fonts.mjs
    ```
    This will generate or update `unused-fonts-report.txt`.

2.  **Run the deletion script**:
    ```bash
    node scripts/delete-unused-fonts.mjs
    ```
    The script will list all the font files it intends to delete and ask for your confirmation before proceeding.

This approach provides a safe way to remove unused fonts, giving you a chance to review the list before any files are permanently deleted.

<!--
[PROMPT_SUGGESTION]Can you add a `npm run clean:fonts` script to package.json that runs both the audit and delete scripts?[/PROMPT_SUGGESTION]
[PROMPT_SUGGESTION]The audit script currently marks a font as "used" if it's imported, even if not actively applied. How can I modify the audit script to only consider fonts "used" if they are actually passed to `useSuspenseFontLoader` or `useMultipleFontLoader`?[/PROMPT_SUGGESTION]
-->
### Asset Management

To keep the repository lean, check for unused font files using the audit script:
```bash
node scripts/audit-fonts.mjs
```
Results are saved to `unused-fonts-report.txt`.

### Performance

- Use lazy loading for heavy assets
- Optimize images before committing
- Test on mobile devices
- Keep bundle size in mind

## 🎨 Design Principles

- **Creative Freedom**: Experiment with typography, color, and motion
- **Accessibility**: Ensure clocks are readable and accessible
- **Responsiveness**: Design for both desktop and mobile
- **Performance**: Keep animations smooth at 60fps
- **Browser Support**: Support modern browsers (Chrome, Firefox, Safari, Edge)

## 📋 Pull Request Process

1. **Create a branch** for your feature

   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes** following the guidelines above

3. **Test thoroughly**

   ```bash
   npm run test:run
   npm run build
   npm run preview
   ```

4. **Commit with clear messages**

   ```bash
   git commit -m "Add: New clock for 26-04-01 with wave animation"
   ```

5. **Push and create PR**

   ```bash
   git push origin feature/your-feature-name
   ```

6. **Describe your PR**:
   - What clock/feature you added
   - Screenshots or GIFs of the clock in action
   - Any technical details or considerations

## 🐛 Reporting Bugs

If you find a bug:

1. Check if it's already reported in Issues
2. Create a new issue with:
   - Clear title and description
   - Steps to reproduce
   - Browser/device information
   - Screenshots if applicable

## 💬 Questions?

- Email: `cubistheart@gmail.com`
- Website: <https://www.cubistheart.com>
- Instagram: [@cubist_heart_labs](https://www.instagram.com/cubist_heart_labs/)

## 📜 Code of Conduct

- Be respectful and constructive
- Welcome newcomers
- Focus on the art and craft of clock-making
- Have fun! 🎨

---

Thank you for helping make BorrowedTime more amazing! 🧊🫀🔭
