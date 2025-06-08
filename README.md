# Catherine Jauffret Portfolio Website

A modern, performant portfolio website built with React Router 7 and Contentful CMS, showcasing collage artworks through a sophisticated web application architecture.

## 🏗️ Architecture Overview

This project is structured as a **pnpm monorepo** with two main packages:

- **`packages/remix`** - Main web application (React Router 7)
- **`packages/functions`** - Serverless functions for form handling
- **`CJCollages/`** - PowerShell module for content management

### Technology Stack

| Layer                  | Technology        | Purpose                                         |
| ---------------------- | ----------------- | ----------------------------------------------- |
| **Framework**          | React Router 7    | SSG/SSR web framework with file-based routing   |
| **Language**           | TypeScript        | Type-safe development                           |
| **CMS**                | Contentful        | Headless CMS for content management             |
| **Data Layer**         | GraphQL + Codegen | Type-safe API queries with auto-generated types |
| **Styling**            | TailwindCSS       | Utility-first CSS framework                     |
| **Animation**          | Framer Motion     | Declarative animations and transitions          |
| **Build Tool**         | Vite              | Fast build tool and dev server                  |
| **Package Manager**    | pnpm              | Efficient package management with workspaces    |
| **Hosting**            | Netlify           | Static site hosting with serverless functions   |
| **Content Management** | PowerShell        | Custom tooling for Contentful operations        |

## 📁 Project Structure

```
catherine-jauffret-website/
├── packages/
│   ├── remix/                    # Main web application
│   │   ├── app/
│   │   │   ├── routes/          # File-based routing
│   │   │   ├── shared/          # Shared utilities and GraphQL client
│   │   │   ├── types/           # TypeScript definitions
│   │   │   └── components/      # React components
│   │   ├── public/              # Static assets
│   │   └── build/               # Build output
│   └── functions/               # Netlify serverless functions
│       └── src/
│           └── submission-created.ts
├── CJCollages/                  # PowerShell content management module
│   ├── CJCollages.psd1         # Module manifest
│   ├── CJCollages.psm1         # Module implementation
│   └── Private/                # Private module functions
└── pnpm-workspace.yaml         # Workspace configuration
```

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+
- **pnpm** 8+
- **Contentful** account with GraphQL API access
- **PowerShell** 7+ (for content management)

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd catherine-jauffret-website
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Environment Setup**

   Create `.env` files in `packages/remix/`:

   ```bash
   # packages/remix/.env
   CONTENTFUL_SPACE_ID=your_space_id
   CONTENTFUL_ACCESS_TOKEN=your_access_token
   CONTENTFUL_PREVIEW_TOKEN=your_preview_token
   CONTENTFUL_ENVIRONMENT=master
   ```

4. **Generate GraphQL Types**

   ```bash
   cd packages/remix
   pnpm graphql:codegen
   ```

5. **Start Development Server**
   ```bash
   pnpm dev
   ```

## 🔧 Development Workflow

### Available Scripts

**Root Level:**

```bash
pnpm dev          # Start all development servers
pnpm build        # Build all packages
pnpm preview      # Preview production builds
```

**Web Application (`packages/remix`):**

```bash
pnpm dev          # Development server (port 5173)
pnpm build        # Production build
pnpm preview      # Preview production build
pnpm typecheck    # TypeScript type checking
pnpm graphql:codegen  # Generate GraphQL types
```

**Functions (`packages/functions`):**

```bash
pnpm build        # Build serverless functions
pnpm dev          # Development server for functions
```

### GraphQL Code Generation

The project uses **GraphQL Code Generator** for type-safe API interactions:

1. **Schema**: Auto-fetched from Contentful GraphQL endpoint
2. **Queries**: Located in `app/routes/` and `app/shared/`
3. **Generated Types**: Output to `app/types/graphql/`

**Configuration**: `packages/remix/codegen.yml`

```yaml
schema: 'https://graphql.contentful.com/content/v1/spaces/${CONTENTFUL_SPACE_ID}'
documents: 'app/**/*.graphql'
generates:
  app/types/graphql/index.ts:
    plugins:
      - typescript
      - typescript-operations
```

### Content Types

**Contentful Content Model:**

| Content Type   | Purpose           | Key Fields                      |
| -------------- | ----------------- | ------------------------------- |
| `collage`      | Artwork entries   | title, image, description, date |
| `homepage`     | Homepage content  | hero text, featured collages    |
| `presentation` | About/bio page    | content, profile image          |
| `cv`           | CV/resume data    | sections, experience, education |
| `guestbook`    | Guestbook entries | name, message, date             |

## 🎨 Styling & UI

### TailwindCSS Configuration

- **Custom Design System**: Extended color palette, typography, spacing
- **Responsive Design**: Mobile-first approach with custom breakpoints
- **Dark Mode**: System preference detection and manual toggle
- **Custom Components**: Reusable UI components with consistent styling

### Animation System

**Framer Motion** integration for:

- Page transitions
- Image loading animations
- Hover effects
- Scroll-triggered animations

## 📡 API Integration

### GraphQL Client

**Location**: `packages/remix/app/shared/graphQLQuery.ts`

**Features**:

- Type-safe query execution
- Error handling
- Caching strategies
- Preview mode support

**Example Usage**:

```typescript
import { graphQLQuery } from '~/shared/graphQLQuery'
import { GetCollagesDocument } from '~/types/graphql'

const data = await graphQLQuery(GetCollagesDocument, {
  variables: { limit: 10 },
})
```

### Route Data Loading

React Router 7 **file-based routing** with co-located data loading:

```typescript
// app/routes/collages.tsx
export async function loader() {
  return await graphQLQuery(GetCollagesDocument)
}

export default function Collages() {
  const data = useLoaderData<typeof loader>()
  // Component implementation
}
```

## 🛠️ Content Management

### PowerShell Module (`CJCollages`)

**Purpose**: Streamline Contentful operations and content management

**Key Functions**:

- Content migration and synchronization
- Bulk operations on collages
- Asset management
- Environment management

**Usage**:

```powershell
Import-Module ./CJCollages
Get-CJCollages -Limit 50
Update-CJCollage -Id "xyz" -Title "New Title"
```

**Module Structure**:

- **Manifest**: `CJCollages.psd1` - Module metadata and dependencies
- **Core Module**: `CJCollages.psm1` - Public function exports
- **Private Functions**: `Private/` - Internal implementation details

## 🌐 Deployment

### Netlify Configuration

**Build Settings**:

- **Build Command**: `pnpm build`
- **Publish Directory**: `packages/remix/build/client`
- **Functions Directory**: `packages/functions/dist`

**Environment Variables**:

```bash
CONTENTFUL_SPACE_ID=your_space_id
CONTENTFUL_ACCESS_TOKEN=your_access_token
CONTENTFUL_ENVIRONMENT=master
NODE_VERSION=18
PNPM_VERSION=8
```

### Static Site Generation

**React Router 7** pre-rendering configuration:

```typescript
// react-router.config.ts
export default {
  ssr: true,
  prerender: ['/', '/collages', '/presentation', '/cv', '/guestbook'],
} satisfies Config
```

**Benefits**:

- **Fast Loading**: Pre-generated HTML
- **SEO Optimized**: Server-side rendering
- **Performance**: Optimal Core Web Vitals

## 🔒 Security & Performance

### Security Measures

- **Environment Variables**: Secure API key management
- **CORS Configuration**: Controlled API access
- **Input Validation**: Form submission sanitization
- **Content Security Policy**: XSS prevention

### Performance Optimizations

- **Image Optimization**: Contentful asset transformations
- **Code Splitting**: Route-based lazy loading
- **Bundle Analysis**: Optimized dependency tree
- **Caching**: Aggressive static asset caching

## 🧪 Testing Strategy

### Type Safety

- **TypeScript**: Compile-time error detection
- **GraphQL Codegen**: API contract validation
- **ESLint**: Code quality and consistency

### Development Tools

- **Hot Module Replacement**: Instant development feedback
- **TypeScript Compiler**: Real-time type checking
- **Prettier**: Automated code formatting

## 📚 Key Dependencies

### Runtime Dependencies

```json
{
  "@remix-run/react": "^2.0.0",
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "graphql": "^16.8.0",
  "framer-motion": "^10.0.0",
  "tailwindcss": "^3.4.0"
}
```

### Development Dependencies

```json
{
  "@graphql-codegen/cli": "^5.0.0",
  "@graphql-codegen/typescript": "^4.0.0",
  "typescript": "^5.2.0",
  "vite": "^5.0.0"
}
```

## 🤝 Contributing

### Development Guidelines

1. **Type Safety**: All new code must be fully typed
2. **GraphQL**: Use code generation for all API interactions
3. **Styling**: Follow TailwindCSS conventions
4. **Performance**: Consider loading implications of changes
5. **Accessibility**: Ensure WCAG 2.1 compliance

### Code Standards

- **ESLint**: Enforce code quality rules
- **Prettier**: Maintain consistent formatting
- **Conventional Commits**: Structured commit messages
- **TypeScript Strict Mode**: Maximum type safety

## 📄 License

This project is proprietary software for Catherine Jauffret's portfolio website.

---

**Built with ❤️ using React Router 7, TypeScript, and Contentful**
