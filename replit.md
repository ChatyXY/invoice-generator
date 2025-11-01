# HR & Payroll Management System

## Overview

A full-stack web-based HR and payroll management system built with React and Express. The application provides comprehensive employee management, attendance tracking, automated invoice generation (PDF), and Excel-based report generation with template auto-fill capabilities. The system uses JWT-based authentication with role-based access control, restricting administrative functions to authorized admin users only.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Build System**
- React 18 with Vite as the build tool and development server
- TypeScript for type safety
- Wouter for client-side routing (lightweight alternative to React Router)

**State Management & Data Fetching**
- TanStack Query (React Query) for server state management, data fetching, and caching
- React Hook Form for form state management and validation

**UI Component System**
- Shadcn/UI component library built on Radix UI primitives
- Tailwind CSS for styling with custom design tokens
- Design philosophy follows modern SaaS patterns (Linear, Vercel, Stripe-inspired)
- Custom theme system supporting light/dark modes with CSS variables
- Typography: Inter for UI, JetBrains Mono for data/tables

**Key Design Patterns**
- Component-based architecture with reusable UI primitives
- Custom hooks for mobile detection and toast notifications
- Context-based authentication state management
- Protected routes pattern with sidebar navigation

### Backend Architecture

**Runtime & Framework**
- Node.js with Express web framework
- TypeScript throughout the stack
- ESM (ES Modules) module system

**Authentication & Security**
- JWT-based authentication with dual-token system:
  - Short-lived access tokens (15 minutes default)
  - Long-lived refresh tokens (7 days default) stored in httpOnly cookies
- Bcrypt for password hashing
- Middleware-based route protection (authenticateToken, isAdmin)
- CORS enabled with credentials support
- Environment-based secret management

**Database Layer**
- MySQL database
- Drizzle ORM for type-safe database queries and schema management
- Connection pooling via mysql2
- Schema-first approach with migrations
- Primary entities: Users, Employees, Invoices, Attendance, Templates, Reports

**API Architecture**
- RESTful API design
- Request validation using express-validator
- Centralized storage abstraction layer (IStorage interface)
- File upload handling via Multer with organized directory structure

**Document Generation Services**
- PDF Generation: Puppeteer for HTML-to-PDF conversion with custom invoice templates
- Excel Processing: ExcelJS for template-based report generation with placeholder replacement ({{variable}} syntax)

**File Storage**
- Local file system storage with organized directories:
  - `/uploads/templates` - Excel and HTML templates
  - `/uploads/invoices` - Generated PDF invoices
  - `/uploads/reports` - Generated Excel reports
- Multer middleware for multipart form data handling
- File type validation on upload

### Data Storage Solutions

**Database Schema**
- `users` - Admin authentication (id, name, email, passwordHash, role)
- `employees` - Employee records (id, nik, name, position, salary, bankAccount)
- `invoices` - Invoice metadata (id, invoiceNumber, employeeId, amount, items as JSON, pdfPath, status)
- `attendance` - Attendance records (id, employeeId, date, status, note)
- `templates` - Uploaded templates (id, name, type, filePath, placeholders as JSON)
- `reports` - Generated reports (id, name, templateId, filePath, data as JSON)

**Data Relationships**
- Foreign key constraints with cascade delete
- Employees → Invoices (one-to-many)
- Employees → Attendance (one-to-many)
- Templates → Reports (one-to-many)

**Migration Strategy**
- Drizzle Kit for schema migrations
- Seed script for initial admin user and sample data
- Default credentials: admin@company.test / admin123

### External Dependencies

**Core Libraries**
- `drizzle-orm` - TypeScript ORM for MySQL
- `express` - Web application framework
- `jsonwebtoken` - JWT token generation and verification
- `bcryptjs` - Password hashing
- `puppeteer` - Headless Chrome for PDF generation
- `exceljs` - Excel file reading/writing
- `multer` - File upload middleware

**Frontend Libraries**
- `@tanstack/react-query` - Server state management
- `react-hook-form` - Form handling
- `@radix-ui/*` - Accessible UI primitives
- `tailwindcss` - Utility-first CSS framework
- `wouter` - Routing
- `lucide-react` - Icon system

**Development Tools**
- `vite` - Build tool and dev server
- `tsx` - TypeScript execution
- `esbuild` - Backend bundling for production
- `drizzle-kit` - Database migrations

**Production Deployment**
- Build process: Frontend (Vite) + Backend (esbuild)
- Environment variables for database connection and JWT secrets
- MySQL database connection via DATABASE_URL
- Static file serving for production builds