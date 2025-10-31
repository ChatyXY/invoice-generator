# Design Guidelines: Admin Panel & Management System

## Design Approach

**Selected Framework:** Modern Admin Dashboard Pattern (Reference-Based)
Drawing inspiration from Linear, Vercel Dashboard, and Stripe Admin for clean, data-focused interfaces that prioritize usability and efficiency.

**Core Principles:**
- Data clarity over decoration
- Efficient workflows with minimal clicks
- Professional, trustworthy aesthetic
- Scannable information hierarchy
- Consistent, predictable patterns

---

## Typography System

**Font Stack:**
- Primary: Inter (via Google Fonts CDN)
- Monospace: JetBrains Mono (for data tables, codes)

**Hierarchy:**
- Page Titles: text-3xl font-semibold (30px)
- Section Headers: text-xl font-semibold (20px)
- Card Titles: text-lg font-medium (18px)
- Body Text: text-base font-normal (16px)
- Table Headers: text-sm font-semibold uppercase tracking-wide (14px)
- Captions/Meta: text-xs text-gray-600 (12px)
- Data Values: text-sm font-mono (for numbers, IDs, dates)

---

## Layout System

**Spacing Primitives:** Tailwind units of 2, 4, 6, and 8 (p-4, gap-6, mb-8, etc.)

**Dashboard Structure:**
```
- Sidebar Navigation: fixed w-64 left sidebar
- Main Content Area: ml-64 with max-w-7xl container
- Top Bar: fixed header with user profile, notifications
- Content Padding: p-6 to p-8 for main sections
- Card Spacing: gap-6 for grid layouts, space-y-4 for stacked content
```

**Grid Patterns:**
- Dashboard Cards: grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6
- Data Tables: Full-width with horizontal scroll on mobile
- Forms: Single column max-w-2xl for optimal input flow
- Two-column layouts: grid-cols-1 lg:grid-cols-3 (sidebar) and lg:col-span-2 (main)

---

## Component Library

### Navigation
**Sidebar:**
- Fixed left navigation (w-64)
- Logo at top with company name
- Grouped menu items with section headers
- Active state: subtle background + accent border-l-4
- Icons from Heroicons (outline style)
- Collapsed state for mobile with hamburger toggle

**Top Bar:**
- Fixed header with breadcrumb trail
- Right-aligned: search bar, notification bell, user avatar dropdown
- Shadow on scroll for depth

### Authentication Pages
**Login Page:**
- Centered card (max-w-md) on neutral background
- Company logo centered above form
- Email and password inputs with visible labels
- Primary CTA button (full width)
- "Remember me" checkbox
- No registration link (admin-only system)

### Dashboard Widgets
**Stat Cards:**
- Grid of 4 cards showing key metrics (total employees, pending invoices, attendance rate, active templates)
- Large number (text-3xl font-bold) with label below
- Small trend indicator (icon + percentage)
- Minimal styling with subtle border

**Recent Activity:**
- Table-style list with avatar + name + action + timestamp
- Compact rows (py-3) with dividers
- "View all" link at bottom

### Data Tables
**Structure:**
- Sticky header row with sortable columns
- Striped rows (alternate background)
- Row hover state for interactivity
- Action buttons (edit, delete) in last column
- Pagination at bottom (showing "1-10 of 234")
- Search input and filter dropdowns above table
- Empty state with icon and helpful message

**Table Elements:**
- Checkboxes for bulk actions (first column)
- Status badges (rounded-full px-3 py-1 text-xs)
- Monospace font for IDs and dates
- Truncated text with tooltip for long content

### Forms
**Layout:**
- Single column with clear field grouping
- Label above input (text-sm font-medium mb-2)
- Input fields with border, focus ring
- Helper text below inputs (text-xs text-gray-600)
- Error states: red border + error message
- Required field indicator (red asterisk)
- Form actions at bottom: Cancel (secondary) + Save (primary) aligned right

**Input Types:**
- Text inputs: h-10 rounded border px-3
- Select dropdowns: native select styled consistently
- Date pickers: input type="date" with calendar icon
- File uploads: drag-drop zone with file preview
- Textarea: min-h-32 for notes/descriptions

### Modals & Overlays
**Modal Structure:**
- Semi-transparent backdrop (backdrop-blur-sm)
- Centered card (max-w-lg) with rounded-lg shadow-xl
- Header with title + close button
- Content area with p-6
- Footer with action buttons (right-aligned)
- Slide-up animation on enter

**Toast Notifications:**
- Top-right corner positioning
- Success/Error/Info variants with icons
- Auto-dismiss after 5 seconds
- Slide-in animation

### Buttons
**Variants:**
- Primary: Solid background, white text, rounded-md px-4 py-2
- Secondary: Border + transparent background
- Danger: Red variant for destructive actions
- Icon-only: Circular buttons for compact actions
- Button groups: Connected buttons for related actions

**States:**
- Hover: Slightly darker shade
- Active: Pressed effect with subtle transform
- Disabled: Reduced opacity + cursor-not-allowed
- Loading: Spinner icon replacing text

### Cards
**Standard Card:**
- White background, border, rounded-lg
- Padding p-6
- Optional header with title and action button
- Shadow-sm on default, shadow-md on hover
- Dividers between sections (border-t my-4)

### Invoice & Report Viewers
**PDF Preview:**
- Embedded viewer with toolbar (download, print, zoom)
- Shadow frame showing document preview
- Metadata sidebar: invoice number, date, amount, status

**Excel Template Manager:**
- File upload area with drag-drop
- Template list showing name, type, placeholders count
- Preview mode showing first few rows
- Fill form with placeholder → value mapping

### Attendance Calendar
**Calendar View:**
- Month view grid (7 columns for days)
- Day cells showing attendance status (color-coded dots)
- Click to see detail or edit
- Legend for status colors
- Navigation arrows for prev/next month

---

## Animations

**Minimal, Purposeful Motion:**
- Page transitions: None (instant navigation)
- Modal/Dropdown: 150ms ease-out
- Hover states: 100ms ease
- Loading states: Gentle pulse animation
- Toast notifications: Slide-in from right (200ms)

---

## Images

**Logo/Branding:**
- Company logo in sidebar top (max-h-10)
- Favicon and login page logo
- PDF invoice templates include logo placeholder

**Icons:**
- Heroicons throughout (via CDN)
- Consistent 20px size for nav items
- 16px for inline icons
- 24px for prominent actions

**No Hero Images:** This is a utility application focused on data management. All screens are functional interfaces without marketing-style hero sections.

**User Avatars:**
- Circular avatars (h-8 w-8 in nav, h-10 w-10 in tables)
- Initials fallback if no photo
- Default placeholder icon if no name

---

## Responsive Behavior

**Breakpoints:**
- Mobile (< 768px): Collapsed sidebar, stacked cards, horizontal scroll tables
- Tablet (768-1024px): Persistent sidebar, 2-column grids
- Desktop (> 1024px): Full layout with 3-4 column grids

**Mobile Adaptations:**
- Hamburger menu for navigation
- Bottom sheet modals instead of centered
- Single column forms
- Horizontal scroll for wide tables with sticky first column