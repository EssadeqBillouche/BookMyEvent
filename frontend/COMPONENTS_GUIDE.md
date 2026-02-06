# Frontend Components Guide

This document outlines the component structure and best practices for the BookMyEvent frontend application.

## Directory Structure

```
frontend/
├── app/                          # Next.js app directory
│   ├── page.tsx                  # Home/Landing page
│   ├── login/page.tsx            # Login page
│   ├── register/page.tsx         # Registration page
│   ├── dashboard/page.tsx        # Protected dashboard
│   ├── layout.tsx                # Root layout
│   └── globals.css               # Global styles
├── components/                   # Reusable components
│   ├── Logo.tsx                  # Brand logo component
│   ├── Navbar.tsx                # Global navigation bar
│   ├── layouts/                  # Layout components
│   │   ├── PageLayout.tsx        # Base page layout with gradient background
│   │   └── AuthLayout.tsx        # Authentication pages layout
│   └── ui/                       # UI components
│       ├── Button.tsx            # Reusable button component
│       ├── Input.tsx             # Form input component
│       ├── Card.tsx              # Card container component
│       ├── StatCard.tsx          # Statistics card component
│       ├── ErrorAlert.tsx        # Error message component
│       └── LoadingSpinner.tsx    # Loading state component
├── contexts/                     # React Context providers
│   └── AuthContext.tsx           # Authentication context
└── lib/                          # Utility libraries
    └── api.ts                    # API client configuration
```

## Component Architecture

### 1. **Layout Components** (`components/layouts/`)

Provide structural wrappers for pages with consistent styling.

#### PageLayout
- **Purpose**: Base layout with gradient background
- **Usage**: Wrap page content that needs the app's signature gradient
- **Props**: `children: ReactNode`

```tsx
import PageLayout from '@/components/layouts/PageLayout';

export default function MyPage() {
  return (
    <PageLayout>
      {/* Your page content */}
    </PageLayout>
  );
}
```

#### AuthLayout
- **Purpose**: Authentication pages layout (login/register)
- **Usage**: Provides centered card with logo, title, and subtitle
- **Props**:
  - `children: ReactNode`
  - `title: string`
  - `subtitle: string`

```tsx
import AuthLayout from '@/components/layouts/AuthLayout';

export default function LoginPage() {
  return (
    <AuthLayout title="Welcome Back" subtitle="Sign in to your account">
      {/* Form content */}
    </AuthLayout>
  );
}
```

### 2. **UI Components** (`components/ui/`)

Reusable interface elements following consistent design patterns.

#### Button
- **Props**:
  - `variant?: 'primary' | 'secondary' | 'outline'` (default: 'primary')
  - `loading?: boolean`
  - All standard HTML button attributes

```tsx
<Button variant="primary" loading={isLoading}>
  Submit
</Button>
```

#### Input
- **Props**:
  - `label: string`
  - `icon: ReactNode`
  - `error?: string`
  - All standard HTML input attributes

```tsx
<Input
  label="Email Address"
  icon={<Mail className="w-5 h-5" />}
  type="email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
/>
```

#### Card
- **Purpose**: White container with rounded corners and shadow
- **Props**: `children: ReactNode`, `className?: string`

```tsx
<Card>
  <h2>Card Title</h2>
  <p>Card content</p>
</Card>
```

#### StatCard
- **Purpose**: Display statistics with icon and description
- **Props**:
  - `title: string`
  - `value: string | number`
  - `subtitle: string`
  - `icon: ReactNode`
  - `iconBgColor: string`
  - `iconColor: string`

```tsx
<StatCard
  title="Events Created"
  value={42}
  subtitle="This month"
  icon={<Calendar className="w-6 h-6" />}
  iconBgColor="#e0f2fe"
  iconColor="#003580"
/>
```

#### ErrorAlert
- **Props**: `message: string`

```tsx
{error && <ErrorAlert message={error} />}
```

#### LoadingSpinner
- **Usage**: Full-screen loading state

```tsx
if (loading) {
  return <LoadingSpinner />;
}
```

### 3. **Common Components** (`components/`)

#### Logo
- **Purpose**: Brand logo with icon and text
- **Usage**: Automatically links to home page

```tsx
import Logo from '@/components/Logo';

<Logo />
```

#### Navbar
- **Purpose**: Global navigation with auth state
- **Features**:
  - Displays user info when authenticated
  - Shows login/signup buttons when not authenticated
  - Logout functionality
  - Sticky positioning

```tsx
import Navbar from '@/components/Navbar';

<Navbar />
```

## Design System

### Color Palette

```css
Primary Blue:    #003580
Accent Blue:     #009fe3
Action Yellow:   #feba02
Neutral Gray:    #7c90a6
```

### Gradients

```css
/* Primary Gradient (Blue) */
background: linear-gradient(to right, #003580, #009fe3);

/* Page Background Gradient */
background: linear-gradient(to bottom right, from-blue-50 via-cyan-50 to-amber-50);

/* Avatar Gradient */
background: linear-gradient(to bottom right, #003580, #009fe3);
```

### Spacing & Sizing

- **Padding**: Use Tailwind classes (`p-4`, `p-6`, `p-8`)
- **Gaps**: Use `space-x-*` and `space-y-*` for consistent spacing
- **Rounded Corners**: Standard is `rounded-lg` (8px) or `rounded-2xl` (16px)
- **Shadows**: Use `shadow-lg` for cards, `shadow-xl` for modals

## Best Practices

### 1. **Component Organization**

- **One component per file**: Each component should have its own file
- **Group related components**: Use subdirectories for related components (e.g., `ui/`, `layouts/`)
- **Barrel exports**: Consider using `index.ts` for cleaner imports

### 2. **Props & TypeScript**

- **Always define prop types**: Use TypeScript interfaces for all props
- **Use descriptive names**: Props should clearly indicate their purpose
- **Default props**: Provide sensible defaults where appropriate

```tsx
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  loading?: boolean;
  children: ReactNode;
}

export default function Button({ 
  variant = 'primary', 
  loading = false, 
  ...props 
}: ButtonProps) {
  // Component logic
}
```

### 3. **Styling**

- **Tailwind CSS first**: Use Tailwind utility classes for styling
- **Inline styles for brand colors**: Use inline styles for specific brand colors
- **Consistent spacing**: Follow Tailwind's spacing scale
- **Responsive design**: Use responsive modifiers (`sm:`, `md:`, `lg:`)

### 4. **State Management**

- **Local state for UI**: Use `useState` for component-specific state
- **Context for global state**: Use AuthContext for authentication
- **Server state**: Consider React Query for API data (future)

### 5. **Error Handling**

- **Try-catch blocks**: Wrap API calls in try-catch
- **User-friendly messages**: Display clear error messages
- **Error boundaries**: Implement error boundaries for production

```tsx
try {
  await login(email, password);
  router.push('/dashboard');
} catch (err: any) {
  setError(err.response?.data?.message || 'An error occurred');
}
```

### 6. **Accessibility**

- **Semantic HTML**: Use proper HTML elements
- **Labels for inputs**: Always provide labels with `htmlFor`
- **ARIA attributes**: Add ARIA labels where needed
- **Keyboard navigation**: Ensure all interactive elements are keyboard accessible

### 7. **Performance**

- **Client components only when needed**: Use `'use client'` directive sparingly
- **Lazy loading**: Use dynamic imports for large components
- **Memoization**: Use `useMemo` and `useCallback` for expensive operations
- **Image optimization**: Use Next.js Image component

## Common Patterns

### Protected Routes

```tsx
'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function ProtectedPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading) return <LoadingSpinner />;
  if (!user) return null;

  return <div>{/* Protected content */}</div>;
}
```

### Form Handling

```tsx
const [formData, setFormData] = useState({ email: '', password: '' });
const [loading, setLoading] = useState(false);
const [error, setError] = useState('');

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setError('');
  setLoading(true);

  try {
    await apiCall(formData);
  } catch (err: any) {
    setError(err.response?.data?.message || 'An error occurred');
  } finally {
    setLoading(false);
  }
};
```

## Future Improvements

1. **Storybook Integration**: Add Storybook for component documentation
2. **Testing**: Add unit tests with Jest and React Testing Library
3. **Theme Provider**: Implement dark mode with context
4. **Form Validation**: Add Zod or Yup for schema validation
5. **Animation Library**: Consider Framer Motion for animations
6. **Barrel Exports**: Add `index.ts` files for cleaner imports

## Migration Notes

If refactoring existing pages:

1. Import the appropriate layout component
2. Replace repeated UI code with component imports
3. Update imports to use `@/components/*` alias
4. Test all interactive functionality
5. Verify responsive behavior

## Support

For questions or issues with components:
- Check this guide first
- Review the component source code
- Consult Tailwind CSS documentation
- Review Next.js documentation for app router patterns
