# Breadcrumb Component

A flexible and accessible breadcrumb navigation component for the Just Holistics frontend application.

## Features

- 🎨 **Consistent Styling**: Follows the project's design system with proper color schemes
- ♿ **Accessible**: Includes proper ARIA labels and semantic HTML
- 📱 **Responsive**: Works well on all screen sizes
- 🔧 **Flexible**: Supports multiple separator types and custom configurations
- 🚀 **Easy to Use**: Simple API with TypeScript support
- 🎯 **Auto-generation**: Hook-based automatic breadcrumb generation from pathname

## Installation

The component is already included in the project. No additional installation required.

## Basic Usage

### Manual Breadcrumbs

```tsx
import Breadcrumb from '@/components/atoms/breadcrumb/Breadcrumb'

const breadcrumbs = [
	{ label: 'Home', href: '/' },
	{ label: 'Community', href: '/community' },
	{ label: 'Pages', isActive: true },
]

<Breadcrumb items={breadcrumbs} />
```

### Automatic Breadcrumbs (Recommended)

```tsx
import { useBreadcrumbs } from '@/hooks/useBreadcrumbs'
import Breadcrumb from '@/components/atoms/breadcrumb/Breadcrumb'

const MyComponent = () => {
	const breadcrumbs = useBreadcrumbs()

	return <Breadcrumb items={breadcrumbs} />
}
```

## Props

### BreadcrumbItem

```typescript
interface BreadcrumbItem {
	label: string // Display text for the breadcrumb
	href?: string // Link URL (optional for active items)
	isActive?: boolean // Whether this is the current page
}
```

### Breadcrumb Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `items` | `BreadcrumbItem[]` | `[]` | Array of breadcrumb items |
| `separator` | `'chevron' \| 'slash' \| 'arrow'` | `'chevron'` | Type of separator between items |
| `className` | `string` | `''` | Additional CSS class |
| `showHome` | `boolean` | `true` | Whether to show home link |
| `homeHref` | `string` | `'/'` | URL for home link |
| `homeLabel` | `string` | `'Home'` | Label for home link |

## Separator Types

- **chevron**: Uses a chevron icon (default)
- **arrow**: Uses an arrow icon
- **slash**: Uses a simple "/" character

## Hooks

### useBreadcrumbs

Automatically generates breadcrumbs based on the current pathname.

```tsx
import { useBreadcrumbs } from '@/hooks/useBreadcrumbs'

const breadcrumbs = useBreadcrumbs({
	config: customConfig, // Optional custom configuration
	customItems: [], // Optional custom items to prepend
	params: { id: '123' }, // Optional route parameters
})
```

### useCustomBreadcrumbs

Generates breadcrumbs for a custom path.

```tsx
import { useCustomBreadcrumbs } from '@/hooks/useBreadcrumbs'

const breadcrumbs = useCustomBreadcrumbs('/custom/path', {
	config: customConfig,
	customItems: [],
	params: { id: '123' },
})
```

## Configuration

### Default Configuration

The component comes with a default configuration for common routes:

```typescript
const defaultBreadcrumbConfig = {
	'/': { label: 'Home' },
	'/community': { label: 'Community', parent: '/' },
	'/community/pages': { label: 'Pages', parent: '/community' },
	'/community/groups': { label: 'Groups', parent: '/community' },
	'/community/events': { label: 'Events', parent: '/community' },
	'/community/videos': { label: 'Videos', parent: '/community' },
	'/protocols': { label: 'Protocols', parent: '/' },
	// ... more routes
}
```

### Custom Configuration

```tsx
import { createBreadcrumbConfig, mergeBreadcrumbConfigs } from '@/util/breadcrumbUtils'

// Create custom configuration
const customConfig = createBreadcrumbConfig('My Page', '/my-page')

// Merge with default configuration
const mergedConfig = mergeBreadcrumbConfigs(defaultConfig, customConfig)

// Use in component
const breadcrumbs = useBreadcrumbs({ config: mergedConfig })
```

## Examples

### Different Separators

```tsx
// Chevron separator (default)
<Breadcrumb items={breadcrumbs} separator="chevron" />

// Arrow separator
<Breadcrumb items={breadcrumbs} separator="arrow" />

// Slash separator
<Breadcrumb items={breadcrumbs} separator="slash" />
```

### Without Home Link

```tsx
<Breadcrumb items={breadcrumbs} showHome={false} />
```

### Custom Home Link

```tsx
<Breadcrumb
	items={breadcrumbs}
	homeHref="/dashboard"
	homeLabel="Dashboard"
/>
```

### Dynamic Routes

```tsx
// For routes like /protocols/[id]
const breadcrumbs = useBreadcrumbs({
	params: { id: '123' },
})
```

## Styling

The component uses CSS modules and follows the project's design system. Key CSS variables used:

- `--jh-green-01`: Primary green color for active items
- `--jh-gray-02`: Default text color
- `--jh-gray-03`: Muted text color for separators
- `--white`: Background color

## Accessibility

- Uses semantic `<nav>` and `<ol>` elements
- Includes proper ARIA labels
- Supports keyboard navigation
- Current page is marked with `aria-current="page"`

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile browsers
- Screen readers

## Demo

To see the component in action, check out the `BreadcrumbDemo` component at `/breadcrumb-demo` (if the route is set up).
