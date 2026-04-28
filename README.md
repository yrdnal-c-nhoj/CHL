# BorrowedTime 🧊🫀🔭

[![CI](https://github.com/yrdnal-c-nhoj/CHL/actions/workflows/ci.yml/badge.svg)](https://github.com/yrdnal-c-nhoj/CHL/actions/workflows/ci.yml)
[![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=flat&logo=vite&logoColor=white)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/react-%2320232a.svg?style=flat&logo=react&logoColor=%2361DAFB)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> _A new clock every day._

BorrowedTime is an online digital art project by Cubist Heart Laboratories. The Lab combines existing material (open source code, appropriated imagery, found type design, etc.) to make a new online clock each day.

[🧊🫀🔭 Take Me There](https://www.cubistheart.com)
[🧊🫀🔭 Contact The Lab](mailto:cubistheart@gmail.com)

---

## 🛠 Technical Stack
*   **Framework**: React 18 + Vite
*   **Language**: TypeScript (Strict Mode)
*   **Routing**: React Router v6
*   **Styling**: CSS Modules + TailwindCSS
*   **Animation**: GSAP + RequestAnimationFrame
*   **Deployment**: Vercel


## 📁 Architecture

The project uses a **Registry-Discovery** pattern. Adding a clock requires zero manual routing:

1.  Create your clock in `src/pages/YYYY/YY-MM/YY-MM-DD/Clock.tsx`.
2.  Register the entry in `src/context/clockpages.json`.
3.  Vite's `import.meta.glob` handles dynamic discovery and code-splitting automatically.

## 💎 The Technical Standard (BTS)
To maintain art quality and performance, every clock must adhere to the **BorrowedTime Technical Standard**:

*   **Type Safety**: Must be written in `.tsx`.
*   **Style Isolation**: Use `.module.css` for clock-specific art.
*   **Semantic Markup**: Use `<main>` for containers and `<time>` for digital displays.
*   **Rendering**: Utilize the `useClockTime` hook for frame-synced updates.
*   **Asset Pipeline**: Use `useSuspenseFontLoader` to prevent Flash of Unstyled Content (FOUC).

## 🎭 Manifesto
*   **We Take Pictures**: Appropriation as appreciation.
*   **We Love Typefaces**: Typography as a secret handshake.
*   **We Use AI**: A new tool is a new toy for learning.
*   **Plus Ars Citius Omni Tempore Nam Quisque**: More Art Faster For Everybody All The Time.

---
_Built with ❤️ by Cubist Heart Laboratories_

#
## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 💌 Contact

- **Email**: `cubistheart@gmail.com`
- **Website**: <https://www.cubistheart.com>
- **Instagram**: [@cubist_heart_labs](https://www.instagram.com/cubist_heart_labs/)
- **X (Twitter)**: [@cubistheartlabs](https://x.com/cubistheartlabs)
- **Facebook**: [Cubist Heart Laboratories](https://www.facebook.com/profile.php?id=100090369371981)

## 📬 Newsletter

Subscribe to our monthly newsletter for project updates and new clock releases:

- Visit the [Contact page](/contact) to subscribe
- Or use the direct Buttondown subscription form

## 🎭 Manifesto

_BorrowedTime_ operates on these principles:

- **We Take Pictures** - We appropriate beautiful images from the infinite scroll of the Internet
- **We Love Typefaces** - Born from passion and shared like a secret handshake
- **We Use Open-Source Code** - We code on the shoulders of giants with gratitude
- **We Believe in Electrons** - Invisible, endlessly jumping at the intersection of Nature, Culture and Technology
- **We Use AI** - A new tool is a new toy for making and learning
- **Plus Ars Citius Omni Tempore Nam Quisque** - More Art Faster For Everybody All The Time

Read the full [manifesto](/manifesto) for our complete philosophy.

---

_Built with ❤️ by Cubist Heart Laboratories_  
_🧊🫀🔭_
