# Sprint 2 Backend: Setup & Database Integration Guide

In **Sprint 2**, we introduce your first backend: an Express.js server that handles user authentication and connects securely to an Azure MySQL database. This guide walks you through:

1. **Backend scaffold** and dependencies
2. **Environment configuration** with `.env`
3. **Whitelisting your IP in Azure**
4. **SSL certificate download & setup from Azure**
5. **Connecting via VS Code & SQLTools**
6. **Creating the **``** table** schema
7. **Running and testing the server**

---

## 📂 Backend Folder Structure

```bash
backend/
├── config/
│   ├── database.js                     # MySQL pool + SSL setup
│   └── AzureMySQLRootCert.pem          # SSL certificate from Azure
├── controllers/
│   └── authController.js               # register & login logic
├── routes/
│   └── auth.js                         # Express routes for auth
├── middleware/                         # (future JWT-protection)
├── .env.example                        # sample env vars for DB & JWT
└── index.js                            # server entry point
```

> **This README applies to the **``** folder.**

---

## 🛠 Prerequisites

- **Node.js & npm** (v14+)
- **VS Code** (with [SQLTools](https://marketplace.visualstudio.com/items?itemName=mtxr.sqltools) + MySQL driver)
- **Azure Database for MySQL** Flexible Server instance

---

## 1. Clone & Install

```bash
cd sprint2-login-backend/backend
npm install
```

---

## 2. Configure Environment Variables

1. Copy `.env.example` → `.env`
   ```bash
   cp .env.example .env
   ```
2. Edit `.env` with your Azure MySQL details:
   ```ini
   DB_HOST=your-server.mysql.database.azure.com
   DB_USER=youruser@your-server
   DB_PASSWORD=Intro2SE!
   DB_NAME=authdb
   DB_PORT=3306

   JWT_SECRET=your_jwt_secret_here
   BACKEND_PORT=3001
   FRONTEND_URL=http://localhost:5173
   ```

> **Keep **``** in **`` to protect your credentials.

---

## 3. Whitelist Your IP in Azure

Azure blocks traffic from unknown IPs until explicitly allowed:

1. In the **Azure Portal**, navigate to your **MySQL Flexible Server**.
2. Under **Networking > Firewall rules**, click **Add my client IP**.
3. Or manually add:
   - **Rule name**: `AllowStudentIP`
   - **Start IP / End IP**: your current public IP
4. Click **Save** and wait a minute for changes to apply.

---

## 4. 🔒 Download the SSL Certificate from Azure

This must be the certificate provided by **Azure** itself (not DigiCert directly) and retrieved from the Azure Portal:

1. **Log into the Azure Portal** at\
   [https://portal.azure.com](https://portal.azure.com)
2. Navigate to your **MySQL Flexible Server** instance:
   - Select **All resources** or go to **Resource groups**, then pick your MySQL server.
3. In the left menu, under **Connection security**, locate **SSL settings**.
4. Click **Download the SSL public certificate**.
5. A `.crt` file will be downloaded (often named `DigiCertGlobalRootCA.crt.pem`).
6. **Move** it into your project:
   ```bash
   mv ~/Downloads/BaltimoreCyberTrustRoot.crt.pem backend/config/AzureMySQLRootCert.pem
   ```
7. In `config/database.js`, update the CA-loading snippet to:
   ```js
   import fs from 'fs';
   import path from 'path';

   // Path to Azure-provided CA cert
   const caPath = path.join(__dirname, 'DigiCertGlobalRootCA.crt.pem');
   const caCert = fs.readFileSync(caPath);
   ```

---

## 5. Connect with VS Code & SQLTools

1. Install **SQLTools** & **MySQL/MariaDB** driver in VS Code.
2. Create a new connection:
   - **Server/Host**: same as `GET FROM GOOGLE DRIVE`
   - **Port**: `3306`
   - **Database**: `authdb`
   - **User**: `GET FROM GOOGLE DRIVE`
   - **Password**: `GET FROM GOOGLE DRIVE`
   - **Use SSL**: ✅
   - **SSL CA file**: `backend/config/AzureMySQLRootCert.pem`
3. **Test** – ensure you see the `authdb` schema in the connection explorer.

---

## 6. Create the `users` Table

Run this SQL in SQLTools or via MySQL CLI:

```sql
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

This matches the expectations in `authController.js`.

---

## 7. Start & Test the Server

```bash
# From backend/ directory
npm run dev    # or `npm start`
```

Expected output:

```
Server is running on port 3001
Successfully connected to MySQL
```

**Test using curl or Postman:**

- **Register**:

  ```bash
  curl -X POST http://localhost:3001/register \
    -H "Content-Type: application/json" \
    -d '{"username":"test","password":"pass123"}'
  ```

- **Login**:

  ```bash
  curl -X POST http://localhost:3001/login \
    -H "Content-Type: application/json" \
    -d '{"username":"test","password":"pass123"}' \
    -c cookie.txt
  ```

---

## 📚 Further Resources

- **Express.js**: [https://expressjs.com/](https://expressjs.com/)
- **dotenv** & 12‑Factor Apps: [https://12factor.net/](https://12factor.net/)
- **mysql2**: [https://github.com/mysqljs/mysql2](https://github.com/mysqljs/mysql2)
- **bcryptjs**: [https://github.com/dcodeIO/bcrypt.js](https://github.com/dcodeIO/bcrypt.js)
- **jsonwebtoken**: [https://github.com/auth0/node-jsonwebtoken](https://github.com/auth0/node-jsonwebtoken)

---

You now have a **secure, SSL-encrypted** authentication backend ready for integration with your frontend. In Sprint 3, we’ll deploy both layers to Azure.

