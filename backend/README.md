# YPR Backend API

## การติดตั้งและใช้งาน

### 1. ติดตั้ง Dependencies
```bash
cd backend

# การติดตั้งปกติ
npm install

# หรือการติดตั้งแบบสะอาด (แนะนำ)
npm run fresh-install

# หรือการติดตั้งเต็มระบบ
npm run setup
```

### 2. แก้ไข Deprecation Warnings (ถ้าจำเป็น)
```bash
# อัปเดต dependencies ทั้งหมด
npm run update-deps

# ตรวจสอบ security vulnerabilities
npm run audit

# แก้ไข security issues อัตโนมัติ
npm run audit-fix
```

### 2. ตั้งค่าฐานข้อมูล
1. สร้างฐานข้อมูล `ypr_db` ใน phpMyAdmin
2. คัดลอกไฟล์ `.env.example` เป็น `.env`
3. แก้ไขการตั้งค่าฐานข้อมูลใน `.env`

```env
DB_HOST=localhost
DB_PORT=3306
DB_NAME=ypr_db
DB_USER=root
DB_PASSWORD=your_password
```

### 3. สร้างตารางและข้อมูลเริ่มต้น
```bash
npm run init-db
```

### 4. รันเซิร์ฟเวอร์
```bash
# Development
npm run dev

# Production
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - เข้าสู่ระบบ
- `GET /api/auth/profile` - ดูข้อมูลโปรไฟล์
- `POST /api/auth/logout` - ออกจากระบบ
- `GET /api/auth/verify` - ตรวจสอบ Token

### ตัวอย่างการใช้งาน

#### Login
```javascript
POST /api/auth/login
Content-Type: application/json

{
  "email": "admin@ypr.local",
  "password": "admin123"
}
```

#### Response
```javascript
{
  "success": true,
  "message": "เข้าสู่ระบบสำเร็จ",
  "data": {
    "user": {
      "id": "uuid-here",
      "email": "admin@ypr.local",
      "role": "admin",
      "title_prefix": "ดร.",
      "first_name": "ผู้ดูแล",
      "last_name": "ระบบ",
      "position": "Administrator",
      "department": "IT Department",
      "permissions": {
        "strategic_issues": ["read", "create", "update", "delete"],
        "strategies": ["read", "create", "update", "delete"],
        "projects": ["read", "create", "update", "delete"],
        "users": ["read", "create", "update", "delete"]
      }
    },
    "token": "jwt-token-here",
    "expires_in": "24h"
  }
}
```

## ผู้ใช้เริ่มต้น

1. **Admin**: `admin@ypr.local` / `admin123`
   - สิทธิ์เต็ม (CRUD ทั้งหมด)

2. **Department**: `dept@ypr.local` / `dept123`
   - อ่านได้: ประเด็นยุทธศาสตร์, กลยุทธ์
   - CRUD: โครงการของตัวเองเท่านั้น
   - ไม่เห็น: หน้าผู้ใช้งาน

## โครงสร้างฐานข้อมูล

### ตาราง users
- `id` (VARCHAR, UUID, Primary Key)
- `email` (VARCHAR, Unique)
- `password` (VARCHAR, Hashed)
- `role` (ENUM: 'admin', 'department')
- `title_prefix` (VARCHAR)
- `first_name` (VARCHAR)
- `last_name` (VARCHAR)
- `position` (VARCHAR)
- `department` (VARCHAR)
- `is_active` (BOOLEAN)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

## การใช้งานกับ Frontend

### Headers ที่ต้องส่ง
```javascript
Authorization: Bearer <jwt-token>
Content-Type: application/json
```

### ตรวจสอบสิทธิ์การใช้งาน
```javascript
// ตัวอย่างการตรวจสอบว่าผู้ใช้สามารถสร้างโครงการได้หรือไม่
if (user.permissions.projects.includes('create')) {
  // แสดงปุ่มสร้างโครงการ
}
```
