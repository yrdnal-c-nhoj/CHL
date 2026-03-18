# BorrowedTime 🧊🫀🔭

*A new clock every day.*

BorrowedTime is a creative digital art project by Cubist Heart Laboratories that delivers a unique clock design each day. Every clock is a distinct exploration of time, typography, and visual aesthetics, combining found imagery, custom fonts, and innovative web technologies.

## 🎨 Project Overview

BorrowedTime creates daily clock experiences that challenge conventional timekeeping through:

- **Unique Daily Designs**: Each day features a completely new clock concept
- **Experimental Typography**: Custom fonts and typographic treatments
- **Found Imagery**: Curated visual elements sourced from across the internet
- **Interactive Elements**: Animations, transitions, and user interactions
- **Responsive Design**: Optimized for both desktop and mobile experiences

## 🚀 Features

### Core Functionality
- **Daily Clock Generation**: New clock design published every day
- **Dynamic Routing**: URL structure `/YY-MM-DD` for each clock
- **Archive Navigation**: Browse through historical clock designs
- **Smart Sorting**: Sort clocks by date, title, or randomly
- **Today's Clock**: Direct access to the current day's design

### Technical Features
- **Modern React Architecture**: Built with React 18 and hooks
- **TypeScript Integration**: Complete migration to TypeScript for enhanced type safety
- **Performance Optimized**: Lazy loading, code splitting, and asset optimization
- **SEO Friendly**: Dynamic meta tags and semantic markup
- **Progressive Web App**: Offline capabilities and app-like experience
- **Advanced Font Loading**: Custom font loading utilities with FOUC prevention
- **Component Library**: Reusable components and utilities

## 🛠 Technology Stack

### Frontend
- **React 18**: Modern React with hooks and concurrent features
- **React Router v6**: Client-side routing with dynamic routes
- **TypeScript**: Gradual adoption for enhanced development experience
- **Vite**: Fast build tool and development server
- **TailwindCSS**: Utility-first CSS framework
- **GSAP**: Advanced animations and transitions

### Development Tools
- **ESLint**: Code quality and consistency
- **Prettier**: Code formatting
- **Vitest**: Unit testing framework
- **TypeScript Compiler**: Static type checking

### Deployment & Infrastructure
- **Vercel**: Hosting and deployment platform
- **GitHub**: Version control and collaboration
- **Node.js 24.x**: Runtime environment

## 📁 Project Structure

```
CHL/
├── src/
│   ├── pages/              # Daily clock implementations
│   │   ├── 25-04/         # Month-based organization
│   │   │   ├── 25-04-01/  # Individual clock
│   │   │   │   └── Clock.tsx
│   │   │   └── ...
│   │   └── 26-03/         # Current month
│   ├── components/        # Reusable UI components
│   │   ├── TopNav.jsx
│   │   ├── Footer.jsx
│   │   ├── Header.jsx
│   │   └── ClockPageNav.jsx
│   ├── context/          # React context for state management
│   │   └── DataContext.jsx
│   ├── types/            # TypeScript type definitions
│   │   └── clock.ts
│   ├── utils/            # Utility functions and helpers
│   │   ├── fontLoader.tsx     # Advanced font loading utilities
│   │   ├── assetLoader.ts     # Asset preloading and management
│   │   ├── clockUtils.ts      # Clock-specific utilities
│   │   └── useFontLoader.js   # Legacy font loader
│   ├── templates/         # Clock templates and patterns
│   │   └── WordClockTemplate.jsx
│   ├── assets/           # Static assets
│   │   ├── fonts/       # Custom typography
│   │   ├── images/      # Found imagery and graphics
│   │   └── i.png, x.png # Social media icons
│   ├── App.jsx           # Main application component
│   ├── Home.jsx          # Homepage with clock archive
│   ├── ClockPage.jsx     # Dynamic clock page renderer
│   ├── Today.jsx         # Today's clock page
│   ├── About.jsx         # About page
│   ├── Manifesto.jsx     # Project manifesto
│   ├── Contact.jsx       # Contact information
│   └── main.jsx          # Application entry point
├── public/               # Public assets
├── package.json          # Dependencies and scripts
├── vite.config.ts       # Vite configuration
├── tailwind.config.js   # TailwindCSS configuration
└── README.md            # This file
```

## 🎯 Clock Design Patterns

Each clock follows a flexible structure while maintaining unique characteristics:

### Common Elements
- **Time Display**: Hours, minutes, and seconds in various formats
- **Typography**: Custom fonts and typographic experiments
- **Visual Effects**: Animations, transitions, and interactive elements
- **Backgrounds**: Found imagery, gradients, or abstract designs
- **Responsive Design**: Mobile and desktop optimizations

### Design Examples
- **26-03-15**: Rotating digits with custom shadow effects and vibrant gradients
- **25-04-01**: Cosmic-themed digital clock with aurora effects and rainbow glow
- **25-05-01**: Lightning-themed clock with shake animations and flash effects
- **25-06-01**: Postal stamp design with jostling animations

## 🚀 Getting Started

### Prerequisites
- Node.js 24.x or higher
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/CHL.git
   cd CHL
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run build:with-types` - Build with TypeScript checking
- `npm run preview` - Preview production build
- `npm run test` - Run tests
- `npm run test:ui` - Run tests with UI
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
- `npm run type-check` - TypeScript type checking
- `npm run clean` - Clean build artifacts

## 🎨 Creating a New Clock

### File Structure
Each clock follows the date-based structure:
```
src/pages/YY-MM/YY-MM-DD/Clock.tsx
```

### Clock Component Template
```typescript
import React, { useState, useEffect } from 'react';
import { useMultipleFontLoader, useStyleInjection } from '../../../utils/fontLoader';
import type { FontConfig } from '../../../types/clock';

const Clock: React.FC = () => {
  const [time, setTime] = useState(new Date());
  
  // Font configuration
  const fontConfigs: FontConfig[] = [
    {
      fontFamily: 'YourFontName',
      fontUrl: fontUrl,
      options: {
        weight: 'normal',
        style: 'normal'
      }
    }
  ];
  
  // Load fonts and inject styles
  const fontsLoaded = useMultipleFontLoader(fontConfigs);
  
  useStyleInjection({
    keyframes: {
      'your-animation': {
        '0%, 100%': { transform: 'translateY(0)' },
        '50%': { transform: 'translateY(-10px)' }
      }
    },
    custom: `
      .your-class {
        /* Custom CSS here */
      }
    `
  });
  
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);
  
  // Don't render until fonts are loaded
  if (!fontsLoaded) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        Loading clock...
      </div>
    );
  }
  
  return (
    <div className="clock-container">
      {/* Your clock design here */}
    </div>
  );
};

export default Clock;
```

### Best Practices
- Use the `useFontLoader` hook for custom fonts to prevent FOUC
- Implement responsive design for mobile and desktop
- Add loading states for better UX
- Use semantic HTML and ARIA labels for accessibility
- Optimize images and assets for performance

## 🌐 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Configure build settings:
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Node.js Version: 24.x
3. Deploy automatically on push to main branch

### Manual Deployment
```bash
npm run build
# Deploy the 'dist' folder to your hosting provider
```

## 📊 Analytics & Monitoring

- **Google Analytics**: Integrated via `react-ga4`
- **Performance Monitoring**: Built-in performance metrics
- **Error Tracking**: Error boundaries for graceful error handling

## 🔧 Configuration

### Environment Variables
Create a `.env` file with:
```env
VITE_GA_ID=your-google-analytics-id
VITE_BASE_URL=https://your-domain.com
```

### Vite Configuration
Key settings in `vite.config.ts`:
- React plugin configuration
- Build optimization
- Development server settings

## 🗺️ Roadmap

### Phase 1: Foundation & Performance (Q1 2025)
- [x] **TypeScript Migration**: Complete migration to TypeScript for all components
- [x] **Advanced Font Loading**: Implement robust font loading with FOUC prevention
- [x] **Component Library**: Create reusable components and utilities
- [ ] **Performance Optimization**: Implement code splitting and lazy loading for all clocks
- [ ] **Error Boundaries**: Add comprehensive error handling and recovery
- [ ] **Testing Suite**: Implement unit and integration tests

### Phase 2: Enhanced User Experience (Q2 2025)
- [ ] **Offline Support**: Implement service worker for offline clock viewing
- [ ] **Accessibility**: Full WCAG 2.1 AA compliance across all clocks
- [ ] **Mobile Optimization**: Touch gestures and mobile-specific interactions
- [ ] **Dark Mode**: System-wide dark/light theme support
- [ ] **Clock Favorites**: Allow users to save and organize favorite clocks
- [ ] **Social Sharing**: Enhanced sharing capabilities with custom previews

### Phase 3: Advanced Features (Q3 2025)
- [ ] **Clock Creator**: Web-based tool for creating custom clock designs
- [ ] **API Integration**: External API support for weather-based themes
- [ ] **Real-time Collaboration**: Multi-user clock design sessions
- [ ] **Advanced Animations**: GSAP-powered animations and transitions
- [ ] **Audio Integration**: Ambient soundscapes synchronized with clock themes
- [ ] **Export Functionality**: Download clocks as images or standalone widgets

### Phase 4: Platform Expansion (Q4 2025)
- [ ] **Mobile Apps**: Native iOS and Android applications
- [ ] **Desktop App**: Electron-based desktop application
- [ ] **Browser Extensions**: Clock widgets for popular browsers
- [ ] **Smart Watch Support**: Apple Watch and Wear OS compatibility
- [ ] **Home Assistant**: Integration with smart home systems
- [ ] **API Public**: Public API for third-party integrations

### Phase 5: Community & Ecosystem (2026)
- [ ] **Community Gallery**: User-submitted clock designs
- [ ] **Design System**: Comprehensive design system documentation
- [ ] **Plugin Architecture**: Plugin system for custom clock behaviors
- [ ] **Educational Content**: Tutorials and workshops for clock design
- [ ] **Open Source Initiative**: Core components as open-source libraries
- [ ] **Design Awards**: Annual clock design competition

### Technical Debt & Maintenance
- [ ] **Code Cleanup**: Remove legacy JavaScript files and consolidate utilities
- [ ] **Documentation**: Comprehensive API documentation and guides
- [ ] **Security Audit**: Regular security assessments and updates
- [ ] **Dependency Updates**: Automated dependency management and updates
- [ ] **Performance Monitoring**: Real-time performance tracking and alerts
- [ ] **CI/CD Pipeline**: Enhanced deployment and testing pipelines

### Infrastructure & DevOps
- [ ] **CDN Implementation**: Global content delivery for assets
- [ ] **Database Migration**: Move from JSON to proper database solution
- [ ] **Caching Strategy**: Implement advanced caching mechanisms
- [ ] **Analytics Enhancement**: Detailed user behavior analytics
- [ ] **Backup Systems**: Automated backup and disaster recovery
- [ ] **Monitoring**: Comprehensive application and infrastructure monitoring

---

## 🤝 Contributing

We welcome contributions to the BorrowedTime project! Here's how you can help:

### Adding New Clocks
1. Create a new clock following the date-based structure
2. Test on multiple devices and browsers
3. Add the clock to the data context
4. Submit a pull request

### Improving Existing Features
- Bug fixes and performance improvements
- New components or utilities
- Documentation updates
- Test coverage improvements

### Development Guidelines
- Follow the existing code style and patterns
- Use TypeScript for new components when possible
- Test your changes thoroughly
- Update documentation as needed

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 💌 Contact

- **Email**: cubistheart@gmail.com
- **Website**: https://www.cubistheart.com
- **Instagram**: [@cubist_heart_labs](https://www.instagram.com/cubist_heart_labs/)
- **X (Twitter)**: [@cubistheartlabs](https://x.com/cubistheartlabs)
- **Facebook**: [Cubist Heart Laboratories](https://www.facebook.com/profile.php?id=100090369371981)

## 📬 Newsletter

Subscribe to our monthly newsletter for project updates and new clock releases:
- Visit the [Contact page](/contact) to subscribe
- Or use the direct Buttondown subscription form

## 🎭 Manifesto

*BorrowedTime* operates on these principles:

- **We Take Pictures** - We appropriate beautiful images from the infinite scroll of the Internet
- **We Love Typefaces** - Born from passion and shared like a secret handshake
- **We Use Open-Source Code** - We code on the shoulders of giants with gratitude
- **We Believe in Electrons** - Invisible, endlessly jumping at the intersection of Nature, Culture and Technology
- **We Use AI** - A new tool is a new toy for making and learning
- **Plus Ars Citius Omni Tempore Nam Quisque** - More Art Faster For Everybody All The Time

Read the full [manifesto](/manifesto) for our complete philosophy.

---

*Built with ❤️ by Cubist Heart Laboratories*  
*🧊🫀🔭*
