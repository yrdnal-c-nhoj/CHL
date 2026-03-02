# BorrowedTime Clock Project

A dynamic clock application that creates a unique visual clock experience for every day of the year. Each day features a different clock component with custom animations, backgrounds, and visual effects.

## 🎯 Overview

BorrowedTime is an experimental digital art project by Cubist Heart Laboratories that delivers a new clock experience every day. The project showcases various web technologies including React, Canvas API, video backgrounds, CSS animations, and creative visual effects.

## 🛠️ Complete Tech Stack

### Frontend Framework & Build Tools
- **React 18.3.1** - Component-based UI framework with hooks
- **Vite 7.1.6** - Fast build tool and development server
- **React Router 6.30.1** - Client-side routing with dynamic routes
- **Node.js 24.x** - Runtime environment

### Styling & CSS
- **Tailwind CSS 4.1.18** - Utility-first CSS framework
- **Styled Components 6.1.19** - CSS-in-JS styling
- **PostCSS** - CSS processing with autoprefixer
- **CSS Modules** - Component-scoped styling

### Visual Effects & Animation Libraries
- **Canvas API** - Custom animations and particle effects
- **GSAP 3.13.0** - Professional animation library
- **Three.js 0.180.0** - 3D graphics and WebGL rendering
- **React Three Fiber 8.18.0** - React renderer for Three.js
- **React Three Drei 9.122.0** - Three.js helpers and abstractions

### Data & APIs
- **Axios 1.13.2** - HTTP client for API requests
- **Google APIs 159.0.0** - Google services integration
- **Twitter API v2 1.27.0** - Social media integration
- **EmailJS Browser 4.4.1** - Email service integration
- **MongoDB 7.0.0** - Database driver

### Development & Utilities
- **ESLint** - Code linting and formatting
- **Babel** - JavaScript transpilation with React preset
- **Vite Plugin Compression** - Brotli compression for production
- **Vite SSG 28.0.0** - Static site generation
- **Puppeteer 24.22.3** - Headless browser automation
- **CSV Parse 6.1.0** - CSV data processing
- **Papa Parse 5.5.3** - CSV parsing library

### Analytics & Monitoring
- **React GA4 2.1.0** - Google Analytics 4 integration
- **Custom Analytics System** - Privacy-aware tracking with DNT support

### Typography & Fonts
- **FontSource Roboto Mono 5.2.8** - Monospace font family
- **FontSource Share Tech Mono 5.2.7** - Technical monospace font
- **300+ Custom Fonts** - Daily unique fonts in TTF/WOFF2 format

## 📁 Complete Project Architecture

```
CHL/
├── public/                     # Static assets and build output
│   ├── index.html             # Main HTML template
│   └── favicon.ico            # Site favicon
├── src/
│   ├── assets/                # Media assets
│   │   ├── fonts/             # 300+ custom fonts (TTF/WOFF2)
│   │   │   ├── 25-04-03-moby.ttf
│   │   │   ├── 26-02-28-atomic.ttf
│   │   │   └── ... (300+ fonts)
│   │   ├── images/            # Date-specific media
│   │   │   └── 26-03/        # Organized by date
│   │   │       ├── 26-03-01/
│   │   │       │   ├── west.mp4
│   │   │       │   ├── cloud.gif
│   │   │       │   └── 270west.webp
│   │   │       └── ...
│   │   ├── i.png              # Instagram icon
│   │   ├── x.png              # X/Twitter icon
│   │   └── fbook.png          # Facebook icon
│   ├── components/            # Reusable React components
│   │   ├── Header.jsx         # Page header with branding
│   │   ├── Footer.jsx         # Page footer
│   │   ├── TopNav.jsx         # Navigation menu
│   │   ├── ClockPageNav.jsx   # Clock navigation with auto-hide
│   │   ├── ImageGrid.jsx      # Dynamic image grid component
│   │   └── DynamicComponent.jsx # Font loading component
│   ├── context/               # React Context providers
│   │   ├── DataContext.jsx    # Main data context
│   │   ├── clockpages.json    # Clock metadata (335 entries)
│   │   └── testclock.json     # Test data
│   ├── pages/                 # Daily clock components
│   │   ├── 26-03/             # March 2026 clocks
│   │   │   ├── 26-03-01/
│   │   │   │   └── Clock.jsx  # Multi-layered clock
│   │   │   ├── 26-03-03/
│   │   │   │   └── Clock.jsx  # Neon rain animation
│   │   │   └── ... (31 days)
│   │   ├── 26-02/             # February 2026
│   │   ├── 26-01/             # January 2026
│   │   └── 25-04/             # April 2025
│   │       └── ... (365 days total)
│   ├── utils/                 # Utility functions
│   └── templates/             # Page templates
├── package.json               # Dependencies and scripts
├── vite.config.js            # Vite configuration
├── tailwind.config.js        # Tailwind CSS configuration
├── postcss.config.cjs        # PostCSS configuration
├── eslint.config.js          # ESLint configuration
├── Dockerfile                # Docker deployment
├── nginx.conf                # Nginx configuration
└── README.md                 # This documentation
```

## 🎨 Clock Component Architecture

### Component Structure Pattern
Each daily clock follows this standardized structure:

```jsx
import React, { useState, useEffect, useMemo, useRef } from 'react';
// Import date-specific assets
import videoAsset from '../../../assets/images/YY-MM/YY-MM-DD/video.mp4';
import imageAsset from '../../../assets/images/YY-MM/YY-MM-DD/image.jpg';
import customFont from '../../../assets/fonts/YY-MM-DD-font.woff2';

const Clock = () => {
  // State management
  const [dimensions, setDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const canvasRef = useRef(null);

  // Effects for animations and lifecycle
  useEffect(() => {
    // Animation logic (canvas, video, particles)
    // Window resize handling
    // Asset loading
  }, []);

  // Memoized calculations for performance
  const tileCoords = useMemo(() => {
    // Grid calculations for tiled elements
    return coordinates;
  }, [dimensions]);

  return (
    <div style={{/* Container styles */}}>
      {/* Layer 1: Background video/image (zIndex: 1) */}
      {/* Layer 2: Tiled overlays (zIndex: 2) */}
      {/* Layer 3: Canvas animations (zIndex: 5) */}
      {/* Layer 4: Content overlay (zIndex: 10) */}
    </div>
  );
};

export default Clock;
```

### Advanced Clock Examples

#### 26-03-01: Multi-Layered Visual Experience
- **Background Layer**: west.mp4 with hue/saturation filter
- **Middle Layer**: Tiled cloud.gif with horizontal flip and opacity
- **Animation Layer**: Neon rain canvas with screen blend mode
- **Content Layer**: Silver analog clock with real-time updates

#### 26-03-03: Pure Canvas Animation
- Neon rain particle system with 30 drops
- Bezier curve ripple effects
- Trail effects with semi-transparent clearing
- Responsive canvas resizing

## 🚀 Core Features & Functionality

### Dynamic Clock Loading System
- **Route-based Loading**: `/YY-MM-DD` URLs map to clock components
- **Asset Preloading**: Images, fonts, and videos loaded before render
- **Fallback System**: Graceful degradation for missing assets
- **Performance Optimization**: Lazy loading and code splitting

### Navigation & UX
- **Auto-hiding Navigation**: Footer fades after inactivity
- **Smooth Transitions**: Loading states and fade animations
- **Keyboard Navigation**: Full accessibility support
- **Touch Support**: Mobile-optimized interactions

### Data Management
- **JSON-driven Metadata**: 335 clocks with titles and dates
- **Environment-based Loading**: Production vs test data
- **Date Validation**: Robust date format checking
- **Sorting System**: Date, title, and random sorting options

### Font Management
- **300+ Custom Fonts**: Daily unique typography
- **Dynamic Font Loading**: Prevents Flash of Unstyled Text
- **Font Isolation**: Each clock gets isolated font context
- **Fallback System**: System fonts as backup

## 🎯 Visual Effects & Animation Techniques

### Canvas Animations
```jsx
// Neon rain particle system
class Drop {
  constructor() {
    this.init();
  }
  
  init() {
    this.x = Math.random() * w;
    this.y = 0;
    this.vy = Math.random() * 1 + 4;
    this.color = 'hsl(220, 100%, 80%)';
  }
  
  draw() {
    // Falling drop or expanding ripple
    if (this.y > this.hit) {
      // Bezier curve ripple effect
    } else {
      // Rectangle drop
    }
    this.update();
  }
}
```

### Video Backgrounds
- **Auto-playing looped videos** with muted attribute
- **CSS Filters**: hue-rotate, saturate, brightness adjustments
- **Responsive Positioning**: Cover entire viewport
- **Performance Optimized**: playsInline for mobile

### Layer System
- **zIndex: 1** - Background video/image
- **zIndex: 2** - Tiled overlays (GIFs, patterns)
- **zIndex: 5** - Canvas animations (particles, effects)
- **zIndex: 10** - Content overlay (clock, text)

## 📊 Analytics & Performance

### Privacy-Aware Analytics
```jsx
// Custom analytics with DNT support
const shouldTrack = () => Boolean(GA_ID) && isProdEnv() && !dntEnabled();

export const pageview = (url) => {
  if (!shouldTrack()) return;
  // Load GA script dynamically
  // Send page view with SPA support
};
```

### Performance Optimizations
- **Code Splitting**: Dynamic imports for clock components
- **Asset Preloading**: Images, fonts, videos loaded before render
- **Memory Management**: Cleanup on component unmount
- **Compression**: Brotli compression for production builds

## 🔧 Configuration Files

### Vite Configuration
```javascript
export default defineConfig({
  plugins: [
    react(),
    viteCompression({
      algorithm: 'brotliCompress',
      ext: '.br',
    }),
  ],
  build: {
    rollupOptions: {
      output: {
        assetFileNames: (assetInfo) => {
          // Organize assets by type
          if (/\.(woff|woff2|eot|ttf|otf)$/i.test(assetInfo.name)) {
            return 'assets/fonts/[name]-[hash][extname]';
          }
          if (/\.(gif|jpe?g|png|svg|webp|avif)$/i.test(assetInfo.name)) {
            return 'assets/images/[name]-[hash][extname]';
          }
          return 'assets/[name]-[hash][extname]';
        },
      },
    },
  },
});
```

### Tailwind CSS Configuration
```javascript
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      // Custom theme extensions
    },
  },
  plugins: [],
};
```

## 🚀 Getting Started

### Prerequisites
- **Node.js 24.x** (specified in package.json engines)
- **npm** or **yarn** package manager

### Installation
```bash
# Clone the repository
git clone <repository-url>
cd CHL

# Install dependencies
npm install

# Environment setup
cp .env.example .env
# Edit .env with your configuration

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Environment Variables
```env
# .env file
VITE_ENVIRONMENT=production
VITE_GA_MEASUREMENT_ID=your_ga_id
VITE_API_URL=your_api_url
```

## 📱 Adding New Clock Components

### Step-by-Step Guide

1. **Create Date Folder Structure**
   ```bash
   mkdir -p src/pages/26-03/26-03-32
   ```

2. **Create Clock Component**
   ```jsx
   // src/pages/26-03/26-03-32/Clock.jsx
   import React, { useState, useEffect, useRef } from 'react';
   import customFont from '../../../assets/fonts/26-03-32-font.woff2';
   import backgroundImage from '../../../assets/images/26-03/26-03-32/bg.jpg';

   const Clock = () => {
     // Your clock implementation
     return (
       <div style={{/* Your styles */}}>
         {/* Your clock content */}
       </div>
     );
   };

   export default Clock;
   ```

3. **Add Assets**
   ```bash
   # Add fonts
   cp your-font.woff2 src/assets/fonts/26-03-32-font.woff2
   
   # Add images/videos
   cp your-bg.jpg src/assets/images/26-03/26-03-32/bg.jpg
   ```

4. **Update Metadata**
   ```json
   // src/context/clockpages.json
   { "path": "26-03-32", "date": "26-03-32", "title": "Your Clock Title" }
   ```

### Clock Component Template
```jsx
import React, { useState, useEffect, useMemo, useRef } from 'react';

const Clock = () => {
  // State for dimensions and interactivity
  const [dimensions, setDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const canvasRef = useRef(null);

  // Window resize handler
  useEffect(() => {
    const handleResize = () => {
      setDimensions({ width: window.innerWidth, height: window.innerHeight });
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Animation logic
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    // Your animation code here
    
    return () => {
      // Cleanup
    };
  }, []);

  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background layers */}
      {/* Animation layers */}
      {/* Content overlay */}
    </div>
  );
};

export default Clock;
```

## 🎨 Design Patterns & Best Practices

### Component Architecture
- **Single Responsibility**: Each clock has one primary visual concept
- **Consistent Layering**: Standardized z-index system
- **Performance First**: Efficient animations and memory management
- **Responsive Design**: Works across all viewport sizes

### Asset Organization
- **Date-based Structure**: Assets organized by `YY-MM/YY-MM-DD/`
- **Font Naming**: `YY-MM-DD-description.ttf/woff2`
- **Image Formats**: WebP for modern browsers, fallbacks for legacy
- **Video Optimization**: MP4 with appropriate compression

### Code Quality
- **ESLint Configuration**: Consistent code style
- **Component Documentation**: Clear comments and JSDoc
- **Error Handling**: Graceful degradation for missing assets
- **Memory Management**: Proper cleanup in useEffect

## 🌐 Deployment & Production

### Build Process
```bash
# Production build with optimizations
npm run build

# Output structure
dist/
├── assets/
│   ├── fonts/     # Optimized fonts
│   ├── images/    # Optimized images
│   └── js/        # Split JavaScript bundles
├── index.html     # Main HTML
└── ...            # Other assets
```

### Environment Configuration
- **Production**: Optimized builds with compression
- **Development**: Hot reload and fast refresh
- **Testing**: Test data and development tools

### Docker Deployment
```dockerfile
FROM node:24-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "preview"]
```

### Vercel Configuration
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "installCommand": "npm install",
  "framework": "vite"
}
```

## 📊 Analytics & SEO

### Google Analytics Integration
- **Privacy-First**: Respects Do Not Track settings
- **SPA Support**: Manual page view tracking
- **Environment-Aware**: Only tracks in production
- **Performance Optimized**: Dynamic script loading

### SEO Optimization
- **Dynamic Meta Tags**: Per-clock titles and descriptions
- **Open Graph**: Social media sharing cards
- **Canonical URLs**: Proper URL canonicalization
- **Structured Data**: JSON-LD for search engines

### Meta Tag System
```jsx
const AnalyticsAndSEO = () => {
  const location = useLocation();
  const path = location.pathname === '/index.html' ? '/' : location.pathname;
  
  const meta = dynamicClockRoute.test(path)
    ? {
        title: `BorrowedTime Clock for ${path.slice(1)}`,
        description: `A clock for ${path.slice(1)} created by Cubist Heart Laboratories.`,
      }
    : {
        title: 'BorrowedTime @ Cubist Heart Laboratories 🧊🫀🔭',
        description: 'A new clock every day.',
      };

  return (
    <Helmet>
      <title>{meta.title}</title>
      <meta name="description" content={meta.description} />
      <meta property="og:title" content={meta.title} />
      <meta property="og:description" content={meta.description} />
      <meta property="og:url" content={`${BASE_URL}${path}`} />
      <meta property="og:type" content="website" />
      <link rel="canonical" href={`${BASE_URL}${path}`} />
    </Helmet>
  );
};
```

## 🔮 Advanced Features

### Dynamic Font Loading
```jsx
const DynamicComponent = () => {
  const [fontReady, setFontReady] = useState(false);
  const fontFamily = `CustomFont_${new Date().toISOString().split('T')[0].replace(/-/g, '')}_${generateRandomString()}`;
  
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @font-face {
        font-family: '${fontFamily}';
        src: url('${fontFile}') format('woff2');
        font-display: block;
      }
    `;
    document.head.appendChild(style);

    const loadFont = async () => {
      await document.fonts.load(`1rem "${fontFamily}"`);
      setFontReady(true);
    };

    loadFont();
    return () => {
      document.head.removeChild(style);
    };
  }, [fontFamily, fontFile]);
};
```

### Image Grid System
```jsx
const ImageGrid = () => {
  const [images, setImages] = useState([]);
  
  useEffect(() => {
    // Vite glob import for all images
    const imageModules = import.meta.glob('/src/assets/images/**/*.{png,jpg,jpeg,gif,svg,webp}', { eager: true });
    const imageUrls = Object.values(imageModules).map(module => module.default);
    setImages(imageUrls);
  }, []);

  // Spiral grid generation from center
  const generateSpiralOrder = () => {
    const cells = [];
    const center = getCenterPosition();
    // Generate cells in spiral pattern
    return cells.sort((a, b) => a.distance - b.distance);
  };
};
```

### Real-time Clock Components
```jsx
const AnalogClock = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const hours = time.getHours() % 12;
  const minutes = time.getMinutes();
  const seconds = time.getSeconds();

  // Calculate angles for smooth hand movement
  const secondAngle = seconds * 6;
  const minuteAngle = minutes * 6 + seconds * 0.1;
  const hourAngle = hours * 30 + minutes * 0.5;

  return (
    <div style={{/* Clock face styles */}}>
      {/* Hour markers */}
      {/* Clock hands with calculated angles */}
      {/* Center pivot */}
    </div>
  );
};
```

## 🤝 Contributing Guidelines

### Development Workflow
1. **Fork Repository** - Create your fork
2. **Feature Branch** - `git checkout -b feature/new-clock`
3. **Development** - Follow coding standards
4. **Testing** - Test across browsers and devices
5. **Documentation** - Update README and comments
6. **Pull Request** - Submit with detailed description

### Code Standards
- **ESLint Configuration**: Follow defined linting rules
- **Component Structure**: Use established patterns
- **Asset Organization**: Follow naming conventions
- **Performance**: Optimize for smooth animations

### Testing Guidelines
- **Cross-browser Testing**: Chrome, Firefox, Safari, Edge
- **Mobile Testing**: iOS Safari, Chrome Mobile
- **Performance Testing**: 60fps animations
- **Accessibility**: Screen reader compatibility

## 📄 License & Attribution

This project is part of Cubist Heart Laboratories' experimental art collection.

### Technology Credits
- **React Team** - For the amazing React framework
- **Vite Team** - For the lightning-fast build tool
- **Three.js Community** - For 3D graphics capabilities
- **Open Source Contributors** - For the countless libraries used

### Art Credits
- **Internet Artists** - For the found images and media
- **Type Designers** - For the beautiful fonts
- **Digital Alchemists** - For transforming the ordinary into extraordinary

## 🔮 Future Roadmap

### Planned Features
- **3D Clock Variations** - Using Three.js and WebGL
- **Audio Integration** - Sound effects and ambient audio
- **User Customization** - Personalizable clock settings
- **Clock Export** - Download clock as image/video
- **Collaborative Creation** - Community-contributed clocks
- **AI-Generated Clocks** - Using AI for unique designs

### Technical Improvements
- **WebAssembly Integration** - For performance-critical animations
- **Service Workers** - Offline functionality
- **WebRTC** - Real-time collaborative features
- **Web Components** - Framework-agnostic components

## 📞 Support & Community

### Getting Help
- **Documentation**: This README and inline code comments
- **Issues**: GitHub Issues for bug reports
- **Contact**: cubistheart@gmail.com
- **Social**: @cubistheartlabs on Instagram and X

### Community
- **Newsletter**: Monthly updates via Buttondown
- **Discord**: Community discussions (coming soon)
- **Workshops**: Clock creation tutorials (planned)

---

## 🎨 Design Philosophy

*BorrowedTime* operates on these core principles:

1. **One Clock Per Day** - Each date gets a unique visual interpretation
2. **Technical Experimentation** - Showcase cutting-edge web technologies
3. **Visual Storytelling** - Each clock tells a different story
4. **Performance First** - Smooth 60fps animations and fast loading
5. **Responsive Design** - Beautiful on all devices and screen sizes
6. **Accessibility** - Usable by everyone, regardless of ability
7. **Privacy Respect** - No tracking without consent
8. **Open Source** - Built with and for the community

## 🌟 Special Thanks

To everyone who contributes to the vast ecosystem of open-source software that makes this project possible. We stand on the shoulders of giants and code with gratitude in our cubist hearts.

---

*BorrowedTime - A new clock every day, because time is the ultimate borrowed resource.*

🧊🫀🔭 *Cubist Heart Laboratories* 🧊🫀🔭
