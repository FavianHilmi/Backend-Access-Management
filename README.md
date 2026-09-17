# Access Management System (Backend API)

Sistem Login & Access Management menggunakan Node.js (Express), PostgreSQL (Knex.js), dan JWT Authentication. Dengan multi-role handling, seleksi role saat login, dan recursive tree menu.

---

## Database Structure & ERD

ERD dapat diakses melalui link berikut atau melihat diagram di bawah ini:
- **Link ERD (dbdiagram.io):** https://dbdiagram.io/d/Access-Management-6a3391305c789b8acbacfa83

---

## Dokumentasi Endpoint API

Semua request yang membutuhkan autentikasi wajib menyertakan Header:
`Authorization: Bearer <jwt_token>`

### 1. Authentication Module

#### `POST /api/auth/login`
Memverifikasi kredensial user. Jika user memiliki lebih dari satu role, API akan mengembalikan daftar role tanpa token login awal.

* **Request Body:**
  ```json
  {
    "username": "andi_ganda",
    "password": "password123"
  }

* **Response (Multi-Role):**
  ```json
  {
    "status": "success",
    "data": {
      "is_multiple_role": true,
      "user_id": 2,
      "roles": [
        { "role_id": 1, "name": "Admin" },
        { "role_id": 2, "name": "Manager" }
      ]
    }
  }

* **Response (Single-Role):**
  ```json
  {
    "status": "success",
    "data": {
      "is_multiple_role": false,
      "token": "eyJhbGc...."
    }
  }

#### `POST /api/auth/select-role`
Menentukan role yang dipilih jika user memiliki lebih dari satu role.

* **Request Body:**
  ```json
  {
    "user_id": 2,
    "role_id": 1
  }

* **Response:**
  ```json
  {
    "status": "success",
    "data": {
      "token": "eyJhbGc...."  
    }
  }

### 2. User & Menu Module
#### `GET /api/user/menus`
Mengambil daftar menu bertingkat (recursive tree) sesuai role user yang teridentifikasi dari JWT token.

* Headers: Authorization: Bearer <token>

* **Response:**
  ```json
  {
    "status": "success",
    "data": [
      {
        "menu_id": 1,
        "name": "Dashboard",
        "path": "/dashboard",
        "children": []
      },
      {
        "menu_id": 2,
        "name": "Settings",
        "path": null,
        "children": [
          {
            "menu_id": 3,
            "name": "User Management",
            "path": "/settings/users",
            "children": []
          }
        ]
      }
    ]
  }
  
### 3. Admin Management Module
#### `POST /api/admin/menus`
Menambahkan master menu baru.

* Headers: Authorization: Bearer <token>

* **Request Body:**
  ```json
  {
    "name": "Reports",
    "path": "/reports",
    "parent_id": null,
    "order_index": 3
  }
  
* **Response:**

  ```json
  {
    "status": "success",
    "message": "Menu berhasil ditambahkan",
    "data": { "menu_id": 10, "name": "Reports" }
  }

#### `POST /api/admin/role-access`
Mengatur hak akses menu untuk role tertentu.

* Headers: Authorization: Bearer <token>

* **Request Body:**
  ```json
  {
    "role_id": 1,
    "menu_ids": [1, 2, 3, 10]
  }
  
* **Response:**
  ```json
  {
    "status": "success",
    "message": "Akses role berhasil diperbarui"
  }

## Cara Menjalankan Project
1. Clone repository ini.
  ```Bash
  git clone https://github.com/username/backend_access_management.git
  cd backend_access_management
  ```

2. Install dependensi.
  ```Bash
  npm install
  ``` 

3. Buat database baru di PostgreSQL:
  ```SQL
  CREATE DATABASE access_management;
  ```

4. Duplikat .env.example menjadi .env
  ```Bash
  cp .env.example .env
  ```
  Atur koneksi database dan JWT_SECRET di file .env. Lalu generate JWT_SECRET acak dengan menjalankan perintah berikut di terminal:
  ```Bash
  node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
  ```
  Salin hasil generate string tersebut dan gunakan sebagai value untuk JWT_SECRET di file .env
  
5. Jalankan migrasi dan seeder database:
  ```Bash
  npx knex migrate:latest
  npx knex seed:run
  ```

6. Jalankan server
   ```Bash
   npm run dev
   ```

7. Akses aplikasi melalui browser di `http://localhost:5000`.

## Testing Credentials
Berikut adalah daftar akun yang sudah ada di seeder database untuk pengujian fitur Single Role dan Multiple Role:

| Username | Password | Role(s) | Test Case |
| :--- | :--- | :--- | :--- |
| budi_admin | password123 | Admin | **Single Role:** Langsung masuk ke Dashboard & akses menu Admin |
| andi_ganda | password123 | Admin, Manager | **Multiple Role:** Muncul modal/pop-up pilih role setelah login |

> **Note:** Semua password di atas telah di-hash menggunakan bcrypt pada database seeder.
