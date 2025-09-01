# Component System Documentation

## Overview

This multi-tenant Astro application uses a sophisticated component system that enables code reuse across multiple sites while maintaining site-specific customization. The system leverages JSON data files for content management and a shared component library for consistent functionality.

## Directory Structure

```
astro-multi-tenant/
├── src/
│   ├── shared/
│   │   └── components/          # Shared component library
│   │       ├── CallToAction/
│   │       ├── Cards/
│   │       ├── Comparison/
│   │       ├── Contact/
│   │       ├── Effects/
│   │       ├── FAQ/
│   │       ├── Features/
│   │       ├── Footer/
│   │       ├── Headers/
│   │       ├── Hero/
│   │       ├── Icons/
│   │       ├── Media/
│   │       ├── Navigation/
│   │       ├── sections/
│   │       ├── Tech/
│   │       └── Testimonials/
│   └── sites/
│       ├── codersinflow.com/
│       │   ├── data/            # Site-specific JSON data
│       │   ├── pages/           # Astro pages
│       │   └── tailwind.config.cjs
│       ├── darkflows.com/
│       │   ├── data/
│       │   ├── pages/
│       │   └── tailwind.config.cjs
│       └── prestongarrison.com/
│           ├── data/
│           ├── pages/
│           └── tailwind.config.cjs
```

## Component Organization

### Shared Components
Components are organized by type rather than by site, promoting maximum reusability:

- **Cards/** - Various card components (ProjectItem, CustomizableCard, DraggableCard, etc.)
- **Headers/** - Header components (TitleHeader, MainTitleHeader, StatusBar, etc.)
- **Hero/** - Hero section variations for different sites
- **Features/** - Feature showcases and grids
- **sections/** - Full page sections (Projects, Qualifications, Skills, etc.)
- **Media/** - Video players and media components
- **Effects/** - Visual effects (ScrollReveal, SwirlingParticles, etc.)

### Component Types

1. **Astro Components** (`.astro`)
   - Server-side rendered
   - Can include client-side scripts
   - Example: `HeroSection.astro`, `FAQ.astro`

2. **React Components** (`.jsx`, `.tsx`)
   - Client-side interactive components
   - Integrated into Astro pages using `client:` directives
   - Example: `ProjectItem.jsx`, `VideoPlayer.tsx`

## JSON Data Loading System

### Data Structure
Each site has its own `data/` directory containing JSON files for content:

```
sites/prestongarrison.com/data/
├── contact.json
├── experiences.json
├── projects.json
├── qualifications.json
└── skills.json
```

### Loading Data in Astro Pages

```astro
---
// In an Astro page (e.g., index.astro)
import projectsData from '../data/projects.json';
import skillsData from '../data/skills.json';
import Projects from '@shared/components/sections/Projects.jsx';

// Data is passed as props to components
---

<Projects 
  projectItems={projectsData.items} 
  header={projectsData.header}
/>
```

### JSON Data Format Examples

#### projects.json
```json
{
  "header": {
    "title": "Projects",
    "description": "Over the years I have taken part in creating many different technologies and projects.",
    "image": "/images/h7group_trans.png",
    "imageDesc": "Lightning Flight Controller"
  },
  "items": [
    {
      "id": 1,
      "image_name": "/images/h743rebuild.png",
      "image_desc": "Lightning H7-OSD",
      "title": "Lightning H7 Flight Controller",
      "desc": "Our latest cutting-edge drone flight controller..."
    }
  ]
}
```

#### skills.json
```json
{
  "programming_languages": [
    { "skill": "C/C++", "level": 5 },
    { "skill": "JavaScript", "level": 5 },
    { "skill": "Python", "level": 4 }
  ],
  "web_frameworks": [
    { "skill": "React", "level": 5 },
    { "skill": "Astro", "level": 4 }
  ]
}
```

## Component Props Pattern

Components accept data through props, making them reusable across sites:

```jsx
// ProjectItem.jsx
const ProjectItem = ({ image_name, image_desc, title, desc }) => {
  return (
    <div className="project-card">
      <img src={image_name} alt={image_desc} />
      <h3>{title}</h3>
      <p>{desc}</p>
    </div>
  );
};
```

```jsx
// Projects.jsx - Section component that uses ProjectItem
const Projects = ({ projectItems = [], header = {} }) => {
  const {
    title = "Projects",
    description = "Default description",
    image = "/default.png",
    imageDesc = "Default"
  } = header;

  return (
    <>
      <TitleHeader
        title={title}
        description={description}
        image={image}
        imageDesc={imageDesc}
      />
      <div className="grid">
        {projectItems.map(item => (
          <ProjectItem key={item.id} {...item} />
        ))}
      </div>
    </>
  );
};
```

## Multi-Tenant Architecture

### Site-Specific Customization

1. **Tailwind Configuration**
   Each site has its own `tailwind.config.cjs` defining:
   - Custom colors
   - Font families
   - Font sizes
   - Theme extensions

2. **Public Assets**
   Each site references its own images and videos from the shared `public/` directory:
   ```
   public/
   ├── images/
   │   ├── site-specific-images/
   │   └── shared-images/
   └── videos/
   ```

3. **Page Composition**
   Sites compose pages using shared components with site-specific data:
   ```astro
   ---
   // prestongarrison.com/pages/index.astro
   import Layout from '../layouts/Layout.astro';
   import Hero from '@shared/components/Hero/Hero.jsx';
   import Projects from '@shared/components/sections/Projects.jsx';
   import projectsData from '../data/projects.json';
   ---
   
   <Layout>
     <Hero />
     <Projects {...projectsData} />
   </Layout>
   ```

## Component Integration Patterns

### Client-Side Hydration
Astro components can include React components with different hydration strategies:

```astro
<!-- Load immediately -->
<VideoPlayer client:load />

<!-- Load when visible -->
<ProjectGrid client:visible />

<!-- Load when idle -->
<Analytics client:idle />

<!-- Load on media query -->
<MobileMenu client:media="(max-width: 768px)" />
```

### Props Passing from Astro to React

```astro
---
// Astro component
import VideoPlayer from '@shared/components/Media/VideoPlayer.tsx';
const videos = await getVideos();
---

<VideoPlayer 
  videos={videos}
  autoplay={true}
  client:load
/>
```

## Styling Strategy

### Component-Level Styling
Components use Tailwind CSS classes with site-specific configurations:

```jsx
// Component uses semantic Tailwind classes
<h2 className="text-header_titlept font-poppins font-bold">
  {title}
</h2>
```

### Site-Specific Overrides
Sites define custom values in their Tailwind config:

```javascript
// prestongarrison.com/tailwind.config.cjs
fontSize: {
  'header_titlept': ['60px', '60px'],
  'header_descpt': ['18px', '20px'],
}
```

## Best Practices

1. **Component Reusability**
   - Keep components generic and data-driven
   - Use props for all customizable content
   - Provide sensible defaults

2. **Data Management**
   - Store all content in JSON files
   - Keep data structure consistent across sites
   - Use TypeScript interfaces when possible

3. **Performance**
   - Use appropriate client directives for hydration
   - Lazy load heavy components
   - Optimize images and media assets

4. **Maintenance**
   - Document component props
   - Keep shared components site-agnostic
   - Test components across all sites

## Example: Adding a New Site

1. Create site directory structure:
   ```bash
   mkdir -p src/sites/newsite.com/{pages,data,components}
   ```

2. Add Tailwind configuration:
   ```javascript
   // src/sites/newsite.com/tailwind.config.cjs
   module.exports = {
     content: [
       './src/**/*.{astro,jsx,tsx}',
       './src/sites/newsite.com/**/*.{astro,tsx}',
       './src/shared/components/**/*.{jsx,tsx}'
     ],
     theme: {
       extend: {
         // Site-specific customizations
       }
     }
   }
   ```

3. Create data files:
   ```json
   // src/sites/newsite.com/data/projects.json
   {
     "header": {
       "title": "Our Work",
       "description": "..."
     },
     "items": []
   }
   ```

4. Compose pages using shared components:
   ```astro
   ---
   // src/sites/newsite.com/pages/index.astro
   import Projects from '@shared/components/sections/Projects.jsx';
   import projectsData from '../data/projects.json';
   ---
   
   <Projects {...projectsData} />
   ```

## Troubleshooting

### Common Issues

1. **Component Not Rendering**
   - Check client directive is appropriate
   - Verify data is being passed correctly
   - Check for console errors

2. **Styling Issues**
   - Ensure Tailwind config includes component paths
   - Verify custom classes are defined
   - Check for CSS specificity conflicts

3. **Data Not Loading**
   - Verify JSON file path is correct
   - Check JSON syntax is valid
   - Ensure props are spread correctly

## Future Improvements

- Implement TypeScript interfaces for all data structures
- Add component testing framework
- Create component documentation generator
- Implement CMS integration for data management
- Add component preview/playground system