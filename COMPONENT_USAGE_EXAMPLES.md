# Component Usage Examples

## Overview
This document shows how to use the new dynamic components that load data from JSON files and support theming through CSS variables.

## 1. Dynamic Features Section
Replaces the hardcoded FeaturesSection with data from JSON.

### Usage in Astro:
```astro
---
import DynamicFeaturesSection from '../components/coders/DynamicFeaturesSection';
---

<DynamicFeaturesSection 
  client:load
  featureSectionRef={featureSectionRef}
  cardPositions={{}}
  dragState={{ isDragging: false, cardId: null }}
  handleMouseDown={(e, id, type) => {}}
/>
```

### Data Source:
`src/data/feature-cards.json`

## 2. Dynamic Feature Grid
Replaces the hardcoded FeatureGrid with 27 features from JSON.

### Usage in Astro:
```astro
---
import DynamicFeatureGrid from '../components/coders/DynamicFeatureGrid';
---

<DynamicFeatureGrid client:visible />
```

### Data Source:
`src/data/features-grid.json`

## 3. Image Showcase (formerly FeatureCarousel)
Interactive image carousel with modal popups.

### Usage:
```tsx
import ImageShowcase from '../components/ui/ImageShowcase';

const showcaseItems = [
  {
    title: "Dashboard View",
    description: "Monitor your development metrics",
    imageSrc: "/dashboard.png"
  },
  // ... more items
];

<ImageShowcase 
  items={showcaseItems}
  title="Platform Screenshots"
  subtitle="See our tools in action"
/>
```

## 4. Hero Scroll Animation (formerly ScrollReveal)
Scroll-triggered hero animation with image reveal.

### Usage:
```tsx
import HeroScrollAnimation from '../components/effects/HeroScrollAnimation';

const heroData = {
  title: "AI-Powered Development",
  subtitle: "Build faster with intelligent assistance",
  finalTitle: "The Future is Here",
  finalSubtitle: "Experience next-gen tools",
  image: "/hero-laptop.png"
};

<HeroScrollAnimation data={heroData} />
```

## 5. Background Particles (formerly SwirlingParticles)
Animated particle background effect.

### Usage:
```tsx
import BackgroundParticles from '../components/effects/BackgroundParticles';

// Default usage
<BackgroundParticles />

// Custom configuration
<BackgroundParticles 
  particleCount={200}
  colors={{
    primary: 'rgb(59, 130, 246)',  // Blue
    secondary: 'rgb(168, 85, 247)'  // Purple
  }}
  className="z-0"
/>
```

## 6. Feature Highlight Section (formerly DataConnectSection)
Section for highlighting features with image and text.

### Usage:
```tsx
import FeatureHighlightSection from '../components/sections/FeatureHighlightSection';

const highlightData = {
  id: "ai-features",
  title: "Intelligent Code Analysis",
  description: "Our AI understands your entire codebase",
  features: [
    {
      title: "50+ Code Detectors",
      subtitle: "Find issues before they become problems"
    },
    {
      title: "Auto-Fix Support",
      subtitle: "200+ types of automatic fixes"
    }
  ],
  image: "/feature-highlight.png"
};

<FeatureHighlightSection 
  data={highlightData}
  imageOnRight={true}
/>

// Alternating layout
<FeatureHighlightSection 
  data={anotherHighlight}
  imageOnRight={false}
/>
```

## CSS Variables Available

All components now use CSS variables for theming:

```css
/* Colors */
--primary           /* Primary brand color */
--primary-dark      /* Darker variant */
--primary-light     /* Lighter variant */
--accent           /* Accent color */
--background       /* Main background */
--surface          /* Card/surface background */
--foreground       /* Text color */
--foreground-muted /* Muted text */

/* Spacing */
--radius           /* Border radius */
--shadow           /* Box shadow */

/* Animation */
--transition       /* Transition duration */
```

## Updating Components with New Data

### To add new features:
1. Edit `src/data/features-grid.json`
2. Add new feature object with required fields
3. Component will automatically render new items

### To change feature cards:
1. Edit `src/data/feature-cards.json`
2. Modify card objects
3. Changes reflect immediately

### To customize theme:
1. Edit CSS variables in `src/styles/global.css`
2. All components will automatically use new values
3. No component code changes needed

## Migration from Old Components

### Old → New Component Mapping:
- `FeaturesSection` → `DynamicFeaturesSection`
- `FeatureGrid` → `DynamicFeatureGrid`
- `FeatureCarousel` → `ImageShowcase`
- `ScrollReveal` → `HeroScrollAnimation`
- `DataConnectSection` → `FeatureHighlightSection`
- `SwirlingParticles` → `BackgroundParticles`

### Benefits:
1. ✅ All content in JSON files - easy to update
2. ✅ Consistent theming via CSS variables
3. ✅ Better component names that describe their purpose
4. ✅ Responsive and accessible
5. ✅ Performance optimized with lazy loading
6. ✅ TypeScript support throughout

## Example Page Integration

```astro
---
import Layout from '../layouts/Layout.astro';
import DynamicFeatureGrid from '../components/coders/DynamicFeatureGrid';
import ImageShowcase from '../components/ui/ImageShowcase';
import BackgroundParticles from '../components/effects/BackgroundParticles';
import FeatureHighlightSection from '../components/sections/FeatureHighlightSection';

// Load data
import showcaseData from '../data/showcase.json';
import highlightData from '../data/highlights.json';
---

<Layout title="Features">
  <!-- Background effect -->
  <BackgroundParticles client:load />
  
  <!-- Main feature grid -->
  <DynamicFeatureGrid client:visible />
  
  <!-- Feature highlights -->
  {highlightData.sections.map((section, index) => (
    <FeatureHighlightSection 
      client:visible
      data={section}
      imageOnRight={index % 2 === 0}
    />
  ))}
  
  <!-- Image showcase -->
  <ImageShowcase 
    client:visible
    items={showcaseData.items}
    title="See It In Action"
  />
</Layout>
```

## Notes
- All components support both client-side React and Astro integration
- Use `client:load` for immediate loading
- Use `client:visible` for lazy loading when scrolled into view
- Components are fully typed with TypeScript
- Responsive breakpoints handled automatically
- Dark theme optimized by default