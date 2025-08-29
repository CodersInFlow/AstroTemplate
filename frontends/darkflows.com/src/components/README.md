# Shared Components Library

A comprehensive React components library combining components from coders.website and prestongarrison.com projects. Built with TypeScript and designed to be framework-agnostic (works with both Astro and Next.js).

## Features

- 🎨 **Flexible Theming** - Light/dark theme support for all components
- 📱 **Responsive Design** - Mobile-first approach with Tailwind CSS
- 🔧 **TypeScript** - Full type safety and IntelliSense support
- 🏗️ **Framework Agnostic** - Works with Astro, Next.js, and other React frameworks
- 📦 **JSON-Driven** - Components accept data via props for maximum flexibility
- ♿ **Accessible** - Built with accessibility best practices

## Installation

```bash
npm install @shared/components
# or
yarn add @shared/components
# or
pnpm add @shared/components
```

## Structure

```
shared-components/
├── src/
│   ├── components/
│   │   ├── blog/       # BlogPost, RichTextRenderer
│   │   ├── cards/      # CustomizableCard, DraggableCard, CardStacker
│   │   ├── sections/   # Hero, Projects, Skills, Features, CallToAction
│   │   ├── layout/     # Header, Footer, Navigation
│   │   ├── ui/         # Button, Input, Card (basic UI elements)
│   │   └── media/      # VideoPlayer, ImageGallery
│   ├── types/          # TypeScript interfaces
│   ├── utils/          # Helper functions
│   └── index.ts        # Main export file
├── package.json
└── README.md
```

## Quick Start

```tsx
import { Hero, Features, Projects, Button } from '@shared/components';

// Hero section with data
const heroData = {
  title: "Welcome to My Site",
  description: "Building amazing experiences with React",
  ctaText: "Get Started",
  ctaLink: "/start"
};

// Features data
const featuresData = [
  {
    id: "1",
    title: "Fast Performance",
    description: "Optimized for speed and efficiency",
    icon: "⚡"
  }
];

function App() {
  return (
    <div>
      <Hero data={heroData} theme="dark" />
      <Features features={featuresData} theme="light" />
      <Button variant="primary">Click me</Button>
    </div>
  );
}
```

## Components

### Blog Components

#### BlogPost
Renders a full blog post with table of contents, image modal, and rich text content.

```tsx
import { BlogPost } from '@shared/components';

const post = {
  id: "1",
  title: "My Blog Post",
  content: "Rich text content...",
  publishedAt: "2024-01-01",
  author: "John Doe",
  tags: ["react", "typescript"]
};

<BlogPost 
  post={post} 
  theme="dark" 
  showTableOfContents={true}
  showCoverImage={true}
/>
```

#### RichTextRenderer
Renders rich text content from JSON format (TipTap compatible).

```tsx
import { RichTextRenderer } from '@shared/components';

<RichTextRenderer 
  content={jsonContent}
  theme="dark"
  enableSyntaxHighlighting={true}
  onImageClick={(src) => console.log(src)}
/>
```

### Card Components

#### CustomizableCard
Mac-style window card with draggable title bar.

```tsx
import { CustomizableCard } from '@shared/components';

<CustomizableCard
  title="My Card"
  width={400}
  height={300}
  theme="dark"
  draggable={true}
  content={<div>Card content here</div>}
/>
```

#### DraggableCard
Similar to CustomizableCard but with enhanced drag functionality.

```tsx
import { DraggableCard } from '@shared/components';

<DraggableCard
  title="Draggable Card"
  cardId="unique-id"
  theme="light"
  onDragStart={(e) => console.log('Drag started')}
  onDragEnd={() => console.log('Drag ended')}
>
  <div>Content</div>
</DraggableCard>
```

#### CardStacker
Container component for managing multiple draggable cards.

```tsx
import { CardStacker } from '@shared/components';

<CardStacker
  theme="dark"
  onDragStart={(cardId, cardType) => console.log('Card drag started')}
  onDragEnd={(cardId, position) => console.log('Card moved')}
>
  <DraggableCard title="Card 1" cardId="1">Content 1</DraggableCard>
  <DraggableCard title="Card 2" cardId="2">Content 2</DraggableCard>
</CardStacker>
```

### Section Components

#### Hero
Flexible hero section with multiple variants.

```tsx
import { Hero } from '@shared/components';

const heroData = {
  title: "Intuitive. Powerful.",
  subtitle: "with visual studio code",
  description: "AI-Powered Code Assistance: Efficient, Affordable, Effective",
  ctaText: "Get Started",
  ctaLink: "/start"
};

<Hero
  data={heroData}
  theme="dark"
  variant="centered" // 'default' | 'centered' | 'split'
  showScrollIndicator={true}
/>
```

#### Projects
Displays a grid of project cards.

```tsx
import { Projects } from '@shared/components';

const projectsData = [
  {
    id: "1",
    title: "My Project",
    description: "Project description",
    image: "/project-image.jpg",
    technologies: ["React", "TypeScript"],
    link: "https://project.com",
    github: "https://github.com/user/project"
  }
];

<Projects
  projects={projectsData}
  title="My Projects"
  description="Here are some projects I've worked on"
  theme="light"
  columns={3}
/>
```

#### Skills
Animated skill bars with categories.

```tsx
import { Skills } from '@shared/components';

const skillsData = [
  {
    id: "1",
    name: "React",
    level: 90,
    category: "Frontend"
  },
  {
    id: "2", 
    name: "TypeScript",
    level: 85,
    category: "Frontend"
  }
];

<Skills
  skills={skillsData}
  title="My Skills"
  description="Technologies I work with"
  theme="dark"
  color="#6366f1"
  showAnimation={true}
  columns={2}
/>
```

#### Features
Grid of feature cards with animations and patterns.

```tsx
import { Features } from '@shared/components';

const featuresData = [
  {
    id: "1",
    title: "Fast Performance",
    description: "Lightning fast loading and rendering",
    icon: "⚡"
  }
];

<Features
  features={featuresData}
  title="Key Features"
  description="What makes our product special"
  theme="dark"
  columns={3}
  showAnimation={true}
  onFeatureClick={(feature) => console.log(feature)}
/>
```

#### CallToAction
Customizable call-to-action section.

```tsx
import { CallToAction } from '@shared/components';

<CallToAction
  title="Ready to get started?"
  description="Join thousands of developers already using our platform"
  primaryButton={{
    text: "Get Started",
    href: "/signup"
  }}
  secondaryButton={{
    text: "Learn More",
    href: "/blog/docs"
  }}
  theme="gradient" // 'light' | 'dark' | 'gradient' | 'minimal'
  variant="default"
/>
```

### Layout Components

#### Header
Responsive header with navigation and mobile menu.

```tsx
import { Header } from '@shared/components';

const navigation = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" }
];

<Header
  logo={{
    text: "My Site",
    href: "/"
  }}
  navigation={navigation}
  ctaButton={{
    text: "Get Started",
    href: "/start"
  }}
  theme="gradient" // 'light' | 'dark' | 'gradient'
  fixed={true}
/>
```

#### Footer
Comprehensive footer with sections and social links.

```tsx
import { Footer } from '@shared/components';

const footerSections = [
  {
    title: "Product",
    links: [
      { label: "Features", href: "/features" },
      { label: "Pricing", href: "/pricing" }
    ]
  }
];

const socialLinks = [
  {
    platform: "Twitter",
    url: "https://twitter.com/user",
    icon: "🐦"
  }
];

<Footer
  logo={{
    text: "My Company",
    href: "/"
  }}
  description="Building the future of web development"
  sections={footerSections}
  socialLinks={socialLinks}
  copyright="© 2024 My Company. All rights reserved."
  theme="gradient"
  columns={4}
/>
```

#### Navigation
Standalone navigation component with dropdown support.

```tsx
import { Navigation } from '@shared/components';

const links = [
  {
    label: "Products",
    href: "/products",
    children: [
      { label: "Web Apps", href: "/products/web" },
      { label: "Mobile Apps", href: "/products/mobile" }
    ]
  }
];

<Navigation
  links={links}
  orientation="horizontal" // 'horizontal' | 'vertical'
  theme="dark"
  activeLink="/products"
  onLinkClick={(href, label) => console.log(href, label)}
/>
```

### UI Components

#### Button
Versatile button component with multiple variants.

```tsx
import { Button } from '@shared/components';

<Button
  variant="primary" // 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
  size="md" // 'sm' | 'md' | 'lg'
  loading={false}
  disabled={false}
  onClick={() => console.log('clicked')}
>
  Click me
</Button>
```

#### Input
Form input with validation and theming.

```tsx
import { Input } from '@shared/components';

<Input
  label="Email"
  type="email"
  placeholder="Enter your email"
  error="Invalid email format"
  helperText="We'll never share your email"
  theme="dark"
  variant="default" // 'default' | 'filled' | 'outlined'
  leftIcon={<EmailIcon />}
/>
```

#### Card
Basic card container with variants.

```tsx
import { Card } from '@shared/components';

<Card
  theme="light"
  variant="elevated" // 'default' | 'elevated' | 'outlined' | 'filled'
  padding="md" // 'none' | 'sm' | 'md' | 'lg'
  hover={true}
  header={<h3>Card Title</h3>}
  footer={<Button>Action</Button>}
>
  Card content here
</Card>
```

### Media Components

#### VideoPlayer
Advanced video player with playlist support.

```tsx
import { VideoPlayer } from '@shared/components';

const videos = [
  {
    id: "1",
    url: "/video1.mp4",
    title: "Introduction Video",
    thumbnail: "/thumb1.jpg",
    duration: "5:30"
  }
];

<VideoPlayer
  videos={videos}
  autoPlay={false}
  muted={true}
  showPlaylist={true}
  theme="dark"
  onVideoChange={(video, index) => console.log('Video changed')}
/>
```

#### ImageGallery
Responsive image gallery with lightbox modal.

```tsx
import { ImageGallery } from '@shared/components';

const images = [
  {
    id: "1",
    src: "/image1.jpg",
    alt: "Image 1",
    title: "Beautiful Landscape",
    thumbnail: "/thumb1.jpg"
  }
];

<ImageGallery
  images={images}
  columns={3} // 2 | 3 | 4 | 5
  showModal={true}
  showThumbnails={true}
  theme="light"
  onImageClick={(image, index) => console.log('Image clicked')}
/>
```

## Theming

All components support light and dark themes through the `theme` prop:

```tsx
// Light theme (default)
<Component theme="light" />

// Dark theme  
<Component theme="dark" />

// Gradient theme (for headers/footers)
<Component theme="gradient" />
```

Components automatically apply appropriate colors, backgrounds, and hover states based on the theme.

## TypeScript Support

The library is built with TypeScript and exports all component props types:

```tsx
import { HeroProps, ProjectData, SkillData } from '@shared/components';

// Use types for your data
const heroData: HeroProps['data'] = {
  title: "My Title",
  description: "My description"
};

const projects: ProjectData[] = [
  {
    id: "1",
    title: "Project",
    description: "Description",
    image: "/image.jpg",
    technologies: ["React"]
  }
];
```

## Utilities

The library includes helpful utility functions:

```tsx
import { 
  cn,           // Combine class names
  formatDate,   // Format dates
  slugify,      // Create URL slugs
  debounce,     // Debounce functions
  throttle,     // Throttle functions
  groupBy       // Group arrays
} from '@shared/components';

// Combine class names
const classes = cn('base-class', condition && 'conditional-class', 'another-class');

// Format date
const formatted = formatDate('2024-01-01'); // "January 1, 2024"

// Create slug
const slug = slugify('My Blog Post Title'); // "my-blog-post-title"
```

## Framework Integration

### Next.js

```tsx
// pages/_app.tsx or app/layout.tsx
import '@shared/components/dist/styles.css'; // If we include styles

// pages/index.tsx
import { Hero, Features } from '@shared/components';

export default function Home() {
  return (
    <main>
      <Hero data={heroData} theme="dark" />
      <Features features={featuresData} />
    </main>
  );
}
```

### Astro

```astro
---
// src/pages/index.astro
import { Hero, Features } from '@shared/components';

const heroData = {
  title: "Welcome",
  description: "My awesome site"
};
---

<html>
  <body>
    <Hero data={heroData} theme="dark" client:load />
    <Features features={featuresData} client:visible />
  </body>
</html>
```

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-component`
3. Make your changes and add tests
4. Commit your changes: `git commit -am 'Add new component'`
5. Push to the branch: `git push origin feature/new-component`
6. Submit a pull request

## Development

```bash
# Install dependencies
npm install

# Start development mode
npm run dev

# Build the library
npm run build

# Run type checking
npm run type-check

# Run linting
npm run lint
```

## License

MIT License - see LICENSE file for details.

## Changelog

### v1.0.0
- Initial release
- Blog, Card, Section, Layout, UI, and Media components
- TypeScript support
- Light/dark theme support
- Framework-agnostic design
- Comprehensive utility functions