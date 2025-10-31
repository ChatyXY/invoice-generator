# Admin Panel Design Guidelines

## Design Framework
Modern SaaS dashboard inspired by Linear, Vercel, and Stripe. Principles: information density without clutter, workflow efficiency, predictable patterns, data-first hierarchy.

## Typography

**Fonts:**
- UI: Inter (Google Fonts)
- Data: JetBrains Mono (tables, IDs, timestamps, code)

**Scale:**
- Page Headers: `text-3xl font-semibold`
- Section Titles: `text-xl font-semibold`
- Card Headers: `text-lg font-medium`
- Body: `text-base`
- Table Headers: `text-sm font-semibold uppercase tracking-wide`
- Table Data: `text-sm font-mono`
- Meta: `text-xs text-gray-600`
- Stats: `text-4xl font-bold`

**Weights:** Semibold (600) headers, Medium (500) subheadings, Normal (400) body, Bold (700) large numbers only.

## Layout

**Spacing:** Use Tailwind units 2, 4, 6, 8 consistently.
- Component padding: `p-4, p-6`
- Section spacing: `mb-6, mb-8`
- Grid gaps: `gap-4, gap-6`
- Form spacing: `space-y-4`

**Structure:**
```
Sidebar: w-64 fixed left
Top Bar: Fixed header h-16
Main: ml-64 max-w-7xl mx-auto p-8
```

**Grids:**
- Dashboard Stats: `grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6`
- Employee Cards: `grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6`
- Forms: `grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-4`

**Containers:** Main `max-w-7xl`, Forms `max-w-2xl`, Modals `max-w-lg` to `max-w-2xl`

## Components

### Navigation

**Sidebar (w-64):**
- Logo top: `h-8` with `text-lg` brand
- Section headers: `text-xs uppercase mb-2`
- Items: `py-2 px-3` with 20px Heroicons
- Active: background + `border-l-4` accent
- Mobile: overlay with backdrop

**Top Bar (h-16):**
- Left: breadcrumbs
- Right: search, notifications (badge), user dropdown
- `flex items-center justify-between shadow-sm z-40`

### Dashboard

**Metric Cards:**
- `border rounded-lg p-6 bg-white`
- Number: `text-4xl font-bold`
- Label: `text-sm text-gray-600`
- Trend: `text-xs` green/red with icon
- Icons: 32px Heroicons

**Activity Feed:**
- Timeline with `border-l` + dots
- Avatar + name + action + timestamp
- `py-3` spacing, max 5 items
- "View all" link bottom

**Quick Actions:**
- 2-column grid, icon + label cards
- Hover elevation increase

### Tables

**Structure:**
- Sticky header: `bg-gray-50`
- Striped rows with hover highlight
- Checkbox column: `w-12`
- Actions column: `w-32`
- Mobile: horizontal scroll, sticky first column

**Features:**
- Search/filter bar above
- Bulk action toolbar when selected
- Pagination: "Showing 1-20 of 234"
- Status badges: `rounded-full px-3 py-1 text-xs font-medium`
- Monospace: IDs, dates, currency
- Empty state: icon + message + CTA

**Columns:**
- Text: left-aligned, truncate with tooltip
- Numbers: right-aligned, monospace
- Dates: monospace (MMM DD, YYYY)
- Status: colored badges
- Actions: right-aligned icon buttons

### Forms

**Layout:**
- Single-column with `border-t pt-6` sections
- Labels: `text-sm font-medium mb-2 block`
- Required: `text-red-500 ml-1`
- Helper: `text-xs text-gray-600 mt-1`
- Error: `text-xs text-red-600 mt-1`

**Inputs:**
- Text/Email/Number: `h-10 border rounded-md px-3 w-full`
- Select: `h-10` with chevron
- Textarea: `min-h-32`
- Date: calendar icon, native picker
- File: dashed border drag-drop with icon
- Checkbox/Radio: custom styled with accent

**Actions:**
- `border-t pt-6 flex justify-end gap-3`
- Cancel: secondary, Save: primary
- Loading: disabled with spinner

### Invoice System

**Generator:**
- Two-column: form `lg:w-2/3` + preview `lg:w-1/3`
- Sections: client, line items, totals
- Live preview (sticky)
- PDF export button

**Viewer:**
- Full-width PDF with toolbar
- Actions: Download, Print, Email, Mark Paid
- Status sidebar: number, date, amount, badge
- Workflow: Draft → Sent → Paid → Overdue

### Excel Templates

**Library:**
- Card grid with file icon, name, placeholder count
- Upload: dashed card with icon
- Preview: modal with first 10 rows

**Autofill:**
- Split: template preview (left) + mapping (right)
- Placeholder → value pairs
- Generate + download buttons

### Attendance

**Calendar:**
- Month grid (7 columns)
- Day cells: date + status dot
- Colors: Present (green), Absent (red), Leave (blue), Holiday (gray)
- Click opens edit modal
- Month nav + legend below

**List View:**
- Table with employee + date + status
- Filter by range/employee
- Bulk mark + export report

### Employees

**List:**
- Card grid: avatar, name, role, department
- Toggle table view
- Hover actions: View, Edit, Deactivate
- Add button top-right

**Detail:**
- Two-column: profile sidebar (1/3) + tabs (2/3)
- Sidebar: large avatar, name, role, contact
- Tabs: Overview, Attendance, Invoices, Documents

### Modals

**Structure:**
- Backdrop: `backdrop-blur-sm bg-black/50`
- Container: `max-w-lg` to `max-w-2xl rounded-lg shadow-2xl`
- Header: `p-6 flex justify-between` + close
- Content: `p-6 max-h-[80vh] overflow-y-auto`
- Footer: `border-t p-6 flex justify-end gap-3`
- Animation: scale + fade 200ms

**Confirmations:**
- Icon top (warning/success)
- Clear question
- Destructive actions in red

### Buttons

**Variants:**
- Primary: solid background, white text, `px-4 py-2 rounded-md`
- Secondary: border, transparent background
- Tertiary: text-only, hover background
- Danger: red for destructive
- Icon-only: `w-8 h-8 rounded`

**States:**
- Hover: darker, 100ms transition
- Active: `scale(0.98)`
- Disabled: `opacity-50 cursor-not-allowed`
- Loading: spinner, disabled

### Cards
- `bg-white border rounded-lg shadow-sm p-6`
- Header: `flex justify-between items-center mb-4`
- Dividers: `border-t my-4 pt-4`
- Clickable hover: `shadow-md transition`

### Toasts
- Position: top-right, stacked `gap-2`
- Variants: Success (green), Error (red), Warning (yellow), Info (blue)
- Content: icon + message + close
- Auto-dismiss: 5s with progress bar
- Animation: slide-in right 200ms

## Animations
**Philosophy:** Purposeful, subtle, fast

**Timing:**
- Hover: 100ms ease
- Modal/dropdown: 150ms ease-out
- Loading: gentle pulse
- Toasts: 200ms slide + fade

**Avoid:** Page transitions, scroll-triggered, decorative motion, parallax

## Images

**No hero images.** Utility-focused only.

**Usage:**
- Logo: sidebar `h-8`, login `h-12`
- Avatars: circular (`h-8` nav, `h-10` tables, `h-24` profile)
- Fallback: initials with colored background
- Icons: Heroicons (20px nav, 16px buttons, 24px actions, 48px empty states)
- File icons: Document, Excel, PDF placeholders
- Empty states: simple icon graphics

## Responsive

**Breakpoints:**
- Mobile (<768px): Stacked, overlay sidebar
- Tablet (768-1024px): Persistent sidebar, 2-column
- Desktop (>1024px): Full layout, 3-4 column

**Mobile:**
- Hamburger menu → sidebar overlay
- Single column cards/forms
- Horizontal scroll tables (sticky first column)
- Full-screen modals
- Bottom sheet quick actions
- **Minimum 44px touch targets**

---

**Key Implementation Rules:**
- Use Tailwind utilities consistently
- Heroicons via CDN
- Inter + JetBrains Mono fonts
- Monospace for all data (IDs, dates, currency)
- Status badges always `rounded-full`
- Forms always single-column with section dividers
- Tables always responsive with horizontal scroll
- Modals always with backdrop blur
- All animations ≤200ms