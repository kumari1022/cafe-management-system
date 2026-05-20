# ☕ Brew Haven Cafe Management System

<div align="center">
  <img src="https://via.placeholder.com/800x200/4F46E5/FFFFFF?text=Brew+Haven+Cafe+Management+System" alt="Project Banner" />
  <br />
  <p><i>A modern, full-stack, and secure Cafe Management System</i></p>
  <p>
    <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
    <img src="https://img.shields.io/badge/Spring_Boot-F2F4F9?style=for-the-badge&logo=spring-boot" alt="Spring Boot" />
    <img src="https://img.shields.io/badge/Java_21-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white" alt="Java 21" />
    <img src="https://img.shields.io/badge/MySQL-005C84?style=for-the-badge&logo=mysql&logoColor=white" alt="MySQL" />
  </p>
</div>

---

## 📖 Project Overview

**Brew Haven Cafe Management System** is a premium, full-stack web application tailored for managing cafe operations efficiently. It streamlines the day-to-day workflow by offering a cohesive digital platform for administrators, staff, and customers. The application leverages a robust Java 21 Spring Boot backend and a dynamic React frontend, seamlessly integrating user authentication, product management, cart handling, and automated billing.

---

## ✨ Features

- 🔐 **Role-Based Authentication:** Secure access control for Admin, Staff, and Customers using JWT.
- 📊 **Admin Dashboard:** Centralized view of cafe analytics, users, and overall operations.
- 👥 **Staff Management:** Assign, manage, and track staff activities effectively.
- ☕ **Product & Category Management:** Easily add, edit, or remove menu items and categorize them.
- 🛒 **Customer Ordering & Cart System:** Intuitive cart functionality for users to browse and place orders.
- 🧾 **Billing & PDF Generation:** Automated invoice generation and PDF exports for completed orders.
- 🖼️ **Product Image Uploads:** Visual menu with support for uploading product images.
- ⭐ **Reviews & Ratings:** Customers can leave feedback and rate their favorite items.
- 📱 **Responsive UI:** Fully responsive design catering to both desktop and mobile users.
- 🌗 **Dark/Light Mode:** Built-in theme toggling for an enhanced user experience.
- 🎨 **Modern Aesthetic:** Beautiful, premium coffee-shop inspired UI with smooth animations.

---

## 👥 User Roles

### 👑 Admin
- Full access to the system.
- Manage users (approve/disable staff and customers).
- Full control over categories, products, and system settings.
- View all bills and comprehensive dashboard statistics.

### 👨‍🍳 Staff
- View and manage daily orders.
- Process customer bills and generate invoices.
- View product catalog and categories.

### 🧑‍💻 Customer/User
- Browse the menu and filter by categories.
- Add items to the cart and place orders.
- Leave reviews and ratings on products.
- View their own billing history.

---

## 🛠️ Tech Stack

### 🎨 Frontend
- **React** - UI Library
- **Vite** - Build Tool
- **TailwindCSS** - Utility-first CSS framework
- **Framer Motion** - Animation library for smooth UI transitions

### ⚙️ Backend
- **Spring Boot 3** - Framework
- **Java 21** - Core Language
- **Spring Security** - Security Framework
- **JWT (JSON Web Tokens)** - Authentication and Authorization

### 🗄️ Database
- **MySQL** - Relational Database
- **Hibernate / JPA** - ORM for database mapping

---

## 📸 Screenshots

| Login Page | Admin Dashboard |
|:---:|:---:|
| *[Add Login Screenshot Here]* | *[Add Dashboard Screenshot Here]* |

| Customer Menu | Cart System |
|:---:|:---:|
| *[Add Menu Screenshot Here]* | *[Add Cart Screenshot Here]* |

| Billing Page | Reviews & Ratings |
|:---:|:---:|
| *[Add Billing Screenshot Here]* | *[Add Reviews Screenshot Here]* |

| Staff Management | |
|:---:|:---:|
| *[Add Staff Management Screenshot Here]* | |

---

## 🎥 Demo Video

> **Watch the system in action:**
>
> 🔗 [Insert YouTube or GitHub Video Link Here]

---

## 📁 Folder Structure

```text
Cafe-Management-System/
├── Frontend/                 # React + Vite application
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   ├── pages/            # Page components
│   │   ├── services/         # API calls
│   │   └── assets/           # Images, styles, etc.
│   └── package.json
└── com.inn.cafe/             # Spring Boot backend
    ├── src/main/java/.../
    │   ├── rest/             # API Controllers
    │   ├── service/          # Business Logic
    │   ├── dao/              # Data Access Objects (Repositories)
    │   ├── model/            # Entities
    │   └── JWT/              # Security and Token management
    └── pom.xml
```

---

## 🚀 Installation Guide

### 1️⃣ Database Setup
1. Install MySQL Server.
2. Create a new database named `cafe`:
   ```sql
   CREATE DATABASE cafe;
   ```
3. Import the default schema/tables if available (or let Hibernate auto-generate them).

### 2️⃣ Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd com.inn.cafe
   ```
2. Open `src/main/resources/application.properties` and update your database credentials:
   ```properties
   spring.datasource.url=jdbc:mysql://localhost:3306/cafe?useSSL=false
   spring.datasource.username=your_mysql_username
   spring.datasource.password=your_mysql_password
   ```
3. Build and run the Spring Boot application:
   ```bash
   mvn clean install
   mvn spring-boot:run
   ```
   *The backend will run on port `8081` (or according to properties).*

### 3️⃣ Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd Frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   *The frontend will be accessible at `http://localhost:5173`.*

### 4️⃣ Run Commands (Batch Scripts)
If you are on Windows, you can use the provided batch scripts for quick startup:
- `start-all.bat` - Starts both frontend and backend.
- `start-backend.bat` - Starts the Spring Boot backend only.
- `start-frontend.bat` - Starts the Vite React frontend only.

---

## 🔑 Default Admin Credentials

> **Email:** `admin@gmail.com`
> **Password:** `admin`

*(Note: Make sure to change these credentials in a production environment!)*

---

## 📡 API Overview

| Endpoint | Method | Role | Description |
|---|---|---|---|
| `/user/signup` | POST | Public | Register a new user |
| `/user/login` | POST | Public | Authenticate user and get JWT |
| `/category/get` | GET | All | Fetch all categories |
| `/product/get` | GET | All | Fetch all products |
| `/bill/generateReport` | POST | Admin/Staff | Generate a bill PDF |
| `/user/get` | GET | Admin | Fetch all registered users |

---

## 🛡️ Security Features
- **Stateless Authentication** using JSON Web Tokens (JWT).
- **Password Encryption** using `BCryptPasswordEncoder`.
- **Role-based Access Control (RBAC)** applied via method-level and URL-level security in Spring Security.
- **CORS Protection** configured for trusted frontend origins.

---

## 🔮 Future Enhancements
- [ ] Integration with a payment gateway (e.g., Stripe, PayPal).
- [ ] Real-time order tracking using WebSockets.
- [ ] Email notifications for account registration and order confirmations.
- [ ] Advanced sales analytics and charts.

---

## 👨‍💻 Author

**Brew Haven Developer**
* GitHub: [@yourusername](https://github.com/yourusername)
* LinkedIn: [Your Profile](https://linkedin.com/in/yourusername)

---

## 📄 License

This project is licensed under the **MIT License**. See the `LICENSE` file for more details.

<p align="center">
  <i>If you found this project helpful, please consider giving it a ⭐️!</i>
</p>
