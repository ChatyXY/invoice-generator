# 📊 HR & Payroll Management System

Sistem manajemen HR dan Payroll berbasis web dengan fitur lengkap untuk mengelola karyawan, absensi, invoice, dan laporan. Aplikasi ini dibuat dengan full-stack JavaScript menggunakan React + Express + PostgreSQL.

## 🎯 Fitur Utama

- ✅ **Autentikasi JWT** - Login admin dengan access token & refresh token
- 👥 **Manajemen Karyawan** - CRUD lengkap untuk data karyawan (NIK, nama, posisi, gaji, dll)
- 📝 **Invoice Generator** - Generate invoice PDF otomatis menggunakan Puppeteer
- 📊 **Excel Report Generator** - Upload template Excel dan auto-fill dengan data karyawan
- 📅 **Absensi (Attendance)** - Kelola kehadiran karyawan (hadir/tidak hadir/cuti)
- 📁 **Upload Template** - Upload template Excel untuk laporan
- 📈 **Dashboard** - Statistik dan overview data karyawan dan keuangan
- 🔒 **Role-based Access** - Hanya admin yang bisa akses panel

## 🚀 Kredensial Login Default

**⚠️ PENTING: Gunakan kredensial ini untuk login pertama kali**

```
Email: admin@company.test
Password: admin123
```

**Catatan:** Segera ubah password setelah login pertama untuk keamanan!

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI framework
- **Vite** - Build tool & dev server
- **Wouter** - Routing
- **TanStack Query** - Data fetching & caching
- **React Hook Form** - Form management
- **Shadcn/UI** - Component library
- **Tailwind CSS** - Styling
- **Lucide React** - Icons

### Backend
- **Node.js** - Runtime
- **Express** - Web framework
- **PostgreSQL** - Database
- **Drizzle ORM** - Database ORM
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **Puppeteer** - PDF generation
- **ExcelJS** - Excel manipulation
- **Multer** - File upload

## 📁 Struktur Database

### Users (Admin)
- `id` - UUID primary key
- `name` - Nama user
- `email` - Email (unique)
- `password_hash` - Password terenkripsi
- `role` - admin/user
- `created_at`, `updated_at`

### Employees (Karyawan)
- `id` - UUID primary key
- `nik` - Nomor Induk Karyawan (unique)
- `name` - Nama karyawan
- `position` - Jabatan
- `bank_account` - Nomor rekening
- `salary` - Gaji
- `created_at`, `updated_at`

### Invoices
- `id` - UUID primary key
- `invoice_number` - Nomor invoice (unique)
- `employee_id` - Referensi ke karyawan
- `amount` - Total amount
- `items` - JSON array of invoice items
- `pdf_path` - Path file PDF
- `status` - pending/paid/overdue
- `created_at`

### Attendance (Absensi)
- `id` - UUID primary key
- `employee_id` - Referensi ke karyawan
- `date` - Tanggal absensi
- `status` - present/absent/leave
- `note` - Catatan
- `created_at`

### Templates
- `id` - UUID primary key
- `name` - Nama template
- `file_path` - Path file template
- `type` - excel/invoice_html
- `placeholders` - JSON array placeholder
- `created_at`

### Reports
- `id` - UUID primary key
- `template_id` - Referensi ke template
- `name` - Nama report
- `generated_path` - Path file hasil
- `meta` - JSON metadata
- `created_by` - Referensi ke user
- `created_at`

## 🚀 Cara Menjalankan Aplikasi

### Prasyarat
- Node.js v20 atau lebih tinggi
- PostgreSQL database (sudah tersetup otomatis di Replit)

### Instalasi & Menjalankan

Aplikasi ini sudah dikonfigurasi untuk berjalan di Replit. Cukup klik tombol **Run** atau jalankan:

```bash
npm run dev
```

Server akan berjalan di `http://localhost:5000` (atau URL Replit Anda).

### Setup Database (Opsional)

Jika database kosong, jalankan migrasi dan seed:

```bash
# Push schema ke database
npm run db:push

# Seed data awal (admin user + sample data)
npx tsx server/seed.ts
```

Ini akan membuat:
- 1 admin user (admin@company.test)
- 3 sample karyawan
- 1 template Excel sample

## 📖 Panduan Penggunaan

### 1. Login
1. Buka aplikasi di browser
2. Masukkan email: `admin@company.test`
3. Masukkan password: `admin123`
4. Klik **Login**

### 2. Dashboard
Setelah login, Anda akan melihat:
- Total karyawan
- Total invoice
- Total absensi bulan ini
- Recent activities

### 3. Kelola Karyawan
- **Lihat semua karyawan**: Menu "Employees"
- **Tambah karyawan baru**: Klik tombol "Add Employee"
  - Isi: NIK, Nama, Posisi, Gaji, No. Rekening
  - Klik "Save"
- **Edit karyawan**: Klik icon edit pada row karyawan
- **Hapus karyawan**: Klik icon delete
- **Cari karyawan**: Gunakan search box

### 4. Generate Invoice (PDF)
- Menu "Invoices"
- Klik "Create Invoice"
- Pilih karyawan
- Masukkan nomor invoice
- Tambah items (deskripsi, qty, harga)
- Klik "Generate Invoice"
- PDF akan otomatis dibuat dan bisa didownload

### 5. Kelola Absensi
- Menu "Attendance"
- Klik "Add Attendance"
- Pilih karyawan
- Pilih tanggal
- Pilih status (Hadir/Tidak Hadir/Cuti)
- Tambah catatan (opsional)
- Klik "Save"

### 6. Generate Laporan Excel
- Menu "Templates"
- Upload template Excel dengan placeholders ({{name}}, {{salary}}, dll)
- Menu "Reports"
- Klik "Generate Report"
- Pilih template
- Pilih karyawan atau data
- Excel akan auto-fill dan siap download

## 🔌 API Endpoints

### Authentication
```
POST   /api/auth/login          - Login (get access token)
POST   /api/auth/refresh        - Refresh access token
POST   /api/auth/logout         - Logout
GET    /api/auth/me             - Get current user
```

### Employees
```
GET    /api/employees           - Get all employees
POST   /api/employees           - Create employee
GET    /api/employees/:id       - Get employee by ID
PUT    /api/employees/:id       - Update employee
DELETE /api/employees/:id       - Delete employee
```

### Invoices
```
GET    /api/invoices            - Get all invoices
POST   /api/invoices            - Create invoice
GET    /api/invoices/:id        - Get invoice by ID
PUT    /api/invoices/:id        - Update invoice
DELETE /api/invoices/:id        - Delete invoice
GET    /api/invoices/:id/pdf    - Generate & download PDF
```

### Attendance
```
GET    /api/attendance          - Get all attendance records
POST   /api/attendance          - Create attendance
GET    /api/attendance/:id      - Get attendance by ID
PUT    /api/attendance/:id      - Update attendance
DELETE /api/attendance/:id      - Delete attendance
```

### Templates
```
GET    /api/templates           - Get all templates
POST   /api/templates/upload    - Upload template file
GET    /api/templates/:id       - Get template by ID
DELETE /api/templates/:id       - Delete template
```

### Reports
```
GET    /api/reports             - Get all reports
POST   /api/reports/generate    - Generate report from template
GET    /api/reports/:id         - Get report by ID
DELETE /api/reports/:id         - Delete report
GET    /api/reports/:id/download - Download generated file
```

## 🧪 Contoh Request (cURL)

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@company.test",
    "password": "admin123"
  }'
```

### Get All Employees
```bash
curl http://localhost:5000/api/employees \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Create Employee
```bash
curl -X POST http://localhost:5000/api/employees \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "nik": "EMP004",
    "name": "Alice Johnson",
    "position": "HR Manager",
    "salary": 55000,
    "bankAccount": "9999999999"
  }'
```

### Create Invoice
```bash
curl -X POST http://localhost:5000/api/invoices \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "invoiceNumber": "INV-2024-001",
    "employeeId": "EMPLOYEE_UUID_HERE",
    "amount": 50000,
    "items": [
      {
        "description": "Monthly Salary",
        "quantity": 1,
        "price": 50000
      }
    ],
    "status": "pending"
  }'
```

## 📂 Struktur Folder

```
.
├── client/                 # Frontend React
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── lib/           # Utilities & helpers
│   │   ├── hooks/         # Custom hooks
│   │   └── App.tsx        # Main app component
│   └── index.html
│
├── server/                # Backend Express
│   ├── services/          # Business logic
│   │   ├── pdf-generator.ts
│   │   └── excel-generator.ts
│   ├── auth.ts           # Authentication logic
│   ├── db.ts             # Database connection
│   ├── routes.ts         # API routes
│   ├── storage.ts        # Data access layer
│   ├── seed.ts           # Database seeding
│   └── index.ts          # Entry point
│
├── shared/               # Shared between FE & BE
│   └── schema.ts         # Database schema & types
│
├── migrations/           # Database migrations
├── uploads/              # Uploaded files & generated PDFs
└── README.md            # This file
```

## 🔐 Keamanan

- ✅ Password di-hash dengan bcrypt
- ✅ JWT dengan expiry time (15 menit access, 7 hari refresh)
- ✅ HTTP-only cookies untuk refresh token
- ✅ Input validation dengan Zod
- ✅ Protected API routes dengan middleware
- ✅ CORS configured

**⚠️ Untuk Production:**
- Ubah `JWT_SECRET` di environment variables
- Ubah password admin default
- Setup HTTPS
- Enable rate limiting
- Review CORS settings

## 🐛 Troubleshooting

### "Login failed" atau "Invalid credentials"
- Pastikan database sudah di-seed (`npx tsx server/seed.ts`)
- Gunakan email: `admin@company.test` dan password: `admin123`
- Check console logs untuk error detail

### Database connection error
- Pastikan PostgreSQL running
- Check environment variables `DATABASE_URL`

### File upload tidak berfungsi
- Pastikan folder `uploads/` ada dan writable
- Check `UPLOAD_DIR` di environment variables

### PDF generation error
- Puppeteer memerlukan Chrome/Chromium
- Di Replit, sudah otomatis terinstall

## 📝 Environment Variables

Aplikasi menggunakan environment variables berikut:

```env
# Server
PORT=5000
NODE_ENV=development

# Database
DATABASE_URL=postgresql://...

# JWT
JWT_SECRET=your-secret-key-here
JWT_REFRESH_SECRET=your-refresh-secret-here
JWT_ACCESS_EXPIRES=15m
JWT_REFRESH_EXPIRES=7d

# Upload
UPLOAD_DIR=./uploads
```

## 📄 Lisensi

MIT License - Bebas digunakan untuk keperluan apapun.

## 🤝 Kontribusi

Aplikasi ini adalah starter template. Silakan customize sesuai kebutuhan Anda!

## 📞 Support

Jika ada pertanyaan atau issue, silakan buat issue di repository atau hubungi developer.

---

**Dibuat dengan ❤️ menggunakan React, Express, dan PostgreSQL**
