# 📊 HR & Payroll Management System

Sistem manajemen HR dan Payroll berbasis web dengan fitur lengkap untuk mengelola karyawan, absensi, invoice, dan laporan. Aplikasi ini dibuat dengan full-stack JavaScript menggunakan React + Express + MySQL.

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
- **MySQL** - Database
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
- MySQL 8.0 atau lebih tinggi

### Setup di Lokal (Komputer Anda)

#### 1. Install Prerequisites
Pastikan sudah install:
- **Node.js v20+** - Download di [nodejs.org](https://nodejs.org)
- **MySQL 8.0+** - Download di [mysql.com](https://dev.mysql.com/downloads/mysql/)

Cek versi:
```bash
node -v   # Harus v20+
npm -v
mysql --version
```

#### 2. Setup Database MySQL
Buat database baru:
```bash
# Login ke MySQL
mysql -u root -p

# Buat database
CREATE DATABASE hr_payroll;

# Keluar dari mysql
EXIT;
```

#### 3. Clone Project & Install Dependencies
```bash
# Clone dari GitHub (jika belum)
git clone <repository-url>
cd <project-folder>

# Install dependencies
npm install
```

Jika error, coba:
```bash
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps
```

#### 4. Setup Environment Variables
Buat file `.env` di root folder:
```env
# Database - GANTI dengan kredensial MySQL Anda!
DATABASE_URL=mysql://root:password_anda@localhost:3306/hr_payroll

# Server
PORT=5000
NODE_ENV=development

# JWT Secrets
JWT_SECRET=your-secret-key-change-in-production
JWT_REFRESH_SECRET=your-refresh-secret-change-in-production
JWT_ACCESS_EXPIRES=15m
JWT_REFRESH_EXPIRES=7d

# Upload Directory
UPLOAD_DIR=./uploads
```

**⚠️ PENTING:** Ganti `password_anda` dengan password MySQL root Anda!

#### 5. Push Database Schema
```bash
npm run db:push
```

#### 6. Seed Database (Data Awal)
```bash
npx tsx server/seed.ts
```

Ini akan membuat:
- 1 admin user (admin@company.test / admin123)
- 3 sample karyawan
- 1 template Excel sample

#### 7. Jalankan Aplikasi
```bash
npm run dev
```

Buka browser: `http://localhost:5000`

### Setup di Replit

Di Replit, cukup:
1. Klik tombol **Run**
2. Database otomatis tersetup
3. Seed database: `npx tsx server/seed.ts`
4. Login dengan kredensial default

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
- **Pastikan MySQL running:**
  - Windows: Cek Services → MySQL80
  - Mac: `brew services start mysql` 
  - Linux: `sudo service mysql start`
- **Check DATABASE_URL di `.env` sudah benar**
- **Test koneksi:** `mysql -u root -p hr_payroll`
- **Error "Access denied":** Password MySQL salah, update di `.env`
- **Error "Unknown database":** Buat database: `CREATE DATABASE hr_payroll;`

### npm install error
```bash
# Hapus dan install ulang
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps
```

### Port 5000 already in use
Ubah PORT di `.env`:
```env
PORT=3000
```

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

# Database - MySQL
DATABASE_URL=mysql://root:password@localhost:3306/hr_payroll

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

**Dibuat dengan ❤️ menggunakan React, Express, dan MySQL**
