# Component Migration and Data Integration Plan

## Phase 1: Data Structure Setup

### 1.1 Create Unified Data Files
- `src/data/site-content.json` - Main content file
- `src/data/features-grid.json` - Feature grid data
- `src/data/testimonials.json` - Testimonials data
- `src/data/tech-stack.json` - Technology stack data

### 1.2 Data Structure Example
```json
{
  "features": {
    "grid": [...],
    "sections": [...],
    "comparison": [...]
  },
  "testimonials": [...],
  "techStack": [...],
  "hero": {...}
}
```

## Phase 2: CSS Variables & Theming

### 2.1 Update global.css
```css
:root {
  /* Core colors */
  --primary: 59 130 246; /* blue-500 */
  --primary-dark: 29 78 216; /* blue-700 */
  --accent: 96 165 250; /* blue-400 */
  
  /* Background colors */
  --background: 10 10 10; /* near black */
  --surface: 31 41 55; /* gray-800 */
  --surface-light: 55 65 81; /* gray-700 */
  
  /* Text colors */
  --foreground: 237 237 237; /* gray-100 */
  --foreground-muted: 156 163 175; /* gray-400 */
  
  /* Semantic colors */
  --success: 34 197 94; /* green-500 */
  --warning: 251 146 60; /* orange-400 */
  --error: 239 68 68; /* red-500 */
  
  /* Spacing */
  --radius: 0.5rem;
  --radius-lg: 1rem;
}
```

### 2.2 Update Tailwind Config
```js
theme: {
  extend: {
    colors: {
      primary: 'rgb(var(--primary) / <alpha-value>)',
      background: 'rgb(var(--background) / <alpha-value>)',
      surface: 'rgb(var(--surface) / <alpha-value>)',
      foreground: 'rgb(var(--foreground) / <alpha-value>)',
    }
  }
}
```

## Phase 3: Component Migration

### 3.1 Components to Convert to Dynamic Data Loading

#### FeaturesSection → DynamicFeaturesSection
- Load from `features.json`
- Props: `data`, `dragHandlers`
- Dynamic icon mapping
- Configurable gradients

#### FeatureGrid → DynamicFeatureGrid  
- Load from `features-grid.json`
- Props: `features`, `columns`, `animations`
- Pattern system from JSON
- Dynamic layout classes

#### TestimonialsSection → DynamicTestimonials
- Load from `testimonials.json`
- Props: `testimonials`, `autoplay`, `interval`
- Avatar system
- Rating display

### 3.2 Components to Import from darkflows.com

#### FeatureCarousel
- **Location**: `src/components/ui/FeatureCarousel.tsx`
- **Modifications**:
  - Update to use site theme colors
  - Make data source configurable
  - Add lazy loading for images

#### ScrollReveal
- **Location**: `src/components/effects/ScrollReveal.tsx`
- **Modifications**:
  - Make scroll triggers configurable
  - Add intersection observer options
  - Support multiple reveal types

#### SwirlingParticles  
- **Location**: `src/components/effects/SwirlingParticles.tsx`
- **Modifications**:
  - Make particle count configurable
  - Add color themes support
  - Performance optimizations for mobile

#### DataConnectSection
- **Location**: `src/components/sections/DataConnectSection.tsx`
- **Modifications**:
  - Rename to FeatureShowcase
  - Support different layouts
  - Add animation variants

## Phase 4: Implementation Steps

### Week 1: Foundation
1. ✅ Analyze existing components
2. ✅ Create migration plan
3. Create JSON data structures
4. Setup CSS variables system
5. Update Tailwind configuration

### Week 2: Core Components
1. Convert FeaturesSection to use JSON
2. Convert FeatureGrid to use JSON
3. Create TestimonialsSection with JSON
4. Update Hero components

### Week 3: Import & Adapt
1. Import FeatureCarousel from darkflows
2. Import ScrollReveal effect
3. Import SwirlingParticles background
4. Adapt DataConnectSection

### Week 4: Integration & Testing
1. Wire up all components with data
2. Ensure responsive behavior
3. Performance optimization
4. Cross-browser testing

## Phase 5: Data Management

### 5.1 Create Data Service
```typescript
// src/services/dataService.ts
export class DataService {
  static async loadFeatures() { }
  static async loadTestimonials() { }
  static async loadSiteContent() { }
}
```

### 5.2 Data Loading Pattern
```typescript
// In Astro components
---
import { DataService } from '../services/dataService';
const features = await DataService.loadFeatures();
---

// In React components
const [features, setFeatures] = useState([]);
useEffect(() => {
  DataService.loadFeatures().then(setFeatures);
}, []);
```

## Phase 6: Performance Considerations

### 6.1 Optimizations
- Lazy load heavy components
- Use React.memo for pure components
- Implement virtual scrolling for long lists
- Image optimization with Next/Image or Astro Image

### 6.2 Bundle Size
- Tree-shake unused Tailwind classes
- Code-split by route
- Dynamic imports for heavy components

## Benefits

### Immediate Benefits
1. **Maintainability**: All content in JSON files
2. **Consistency**: Shared design tokens via CSS variables
3. **Reusability**: Components work across projects
4. **Performance**: Better lazy loading and optimization

### Long-term Benefits
1. **CMS-Ready**: Easy to connect to headless CMS
2. **A/B Testing**: Swap content via JSON
3. **Internationalization**: Multi-language support
4. **White-labeling**: Theme switching via CSS variables

## Success Metrics
- [ ] All hardcoded content moved to JSON
- [ ] CSS variables implemented for all colors
- [ ] 4+ components imported from darkflows
- [ ] Page load time < 2s
- [ ] Lighthouse score > 90

## Notes
- Keep backward compatibility during migration
- Document all new props and data structures
- Create Storybook stories for imported components
- Consider creating a shared component library