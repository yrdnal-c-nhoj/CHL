# Contributing to BorrowedTime

Thank you for contributing to our daily art project. To maintain a high technical bar, we follow the **BorrowedTime Technical Standard (BTS)**.

## 🚀 Getting Started

1.  **Clone & Setup**: Install dependencies and copy `.env.example`.
2.  **Branching**: Work on a descriptive branch name (e.g., `feature/26-05-12-neon-clock`).
3.  **Development**: Run `npm run dev` to see your changes in real-time.

## 🎯 Adding a New Clock

### 1. File Structure
Clocks must be organized by date in `src/pages/YYYY/YY-MM/YY-MM-DD/`:
```text
├── Clock.tsx
├── Clock.module.css
└── assets/ (optional imagery/fonts)
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
