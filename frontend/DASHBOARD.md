# Loan Management System - Dashboard

A modern, responsive dashboard for loan management built with React, React Router, and Tailwind CSS.

## Features

- ✨ **Modern UI**: Beautiful gradient sidebar with smooth animations
- 📱 **Fully Responsive**: Works seamlessly on desktop, tablet, and mobile devices
- 🎨 **Tailwind CSS**: Utility-first CSS framework for rapid UI development
- 🧭 **React Router**: Client-side routing with nested layouts
- 🎯 **TypeScript**: Type-safe code for better development experience
- ⚡ **Vite**: Lightning-fast development server and build tool

## Project Structure

```
frontend/
├── src/
│   ├── layouts/
│   │   └── DashboardLayout.tsx    # Main dashboard layout with sidebar
│   ├── pages/
│   │   ├── Dashboard.tsx          # Home dashboard with stats
│   │   ├── Users.tsx              # User management page
│   │   ├── Loans.tsx              # Loan management page
│   │   ├── Payments.tsx           # Payment tracking page
│   │   ├── Reports.tsx            # Reports and analytics
│   │   └── Settings.tsx           # Application settings
│   ├── App.tsx                    # Main app with routing
│   └── main.tsx                   # Application entry point
```

## Pages

1. **Dashboard** (`/`) - Overview with statistics and recent activity
2. **Users** (`/users`) - User management with table view
3. **Loans** (`/loans`) - Loan application management
4. **Payments** (`/payments`) - Payment tracking and history
5. **Reports** (`/reports`) - Analytics and reporting
6. **Settings** (`/settings`) - Application configuration

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Technologies Used

- **React 19** - UI library
- **React Router 7** - Routing
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Heroicons** - Icon library
- **Vite** - Build tool
- **Zustand** - State management (ready to use)

## Development

The application uses:
- **Hot Module Replacement (HMR)** for instant updates during development
- **ESLint** for code quality
- **TypeScript** for type checking

## Layout Features

### Sidebar
- Collapsible on mobile devices
- Active route highlighting
- Smooth transitions and animations
- User profile section at the bottom

### Header
- Page title based on current route
- Notification bell with indicator
- User profile dropdown (placeholder)
- Mobile menu toggle

### Main Content
- Responsive padding and spacing
- Smooth page transitions
- Consistent styling across all pages

## Customization

### Colors
The dashboard uses an indigo color scheme. To customize:
- Edit Tailwind classes in component files
- Modify `tailwind.config.js` for global theme changes

### Navigation
Add new routes in `src/App.tsx`:
```tsx
<Route path="new-page" element={<NewPage />} />
```

Add navigation items in `src/layouts/DashboardLayout.tsx`:
```tsx
{ name: 'New Page', href: '/new-page', icon: IconName }
```

## License

MIT
