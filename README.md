# Cafe Management System

Full-stack cafe management app with:

- Backend: Spring Boot (`com.inn.cafe`)
- Frontend: React + Vite (`Frontend`)
- Database: MySQL (`cafesystem`)

## Prerequisites

- Java 17+ (Java 20 works)
- Node.js LTS + npm
- MySQL running locally

## Database Setup (Required)

1. Create/import database using `sql.sql`:
   - Open MySQL Workbench (or mysql CLI)
   - Run the script from `sql.sql`
2. Make sure DB name is `cafesystem`
3. Confirm backend DB credentials in `com.inn.cafe/src/main/resources/application.properties`

## One-Click Run (Windows)

From project root, double-click:

- `start-all.bat`

This opens 2 terminals and starts:

- Backend: `http://localhost:8082`
- Frontend: `http://localhost:5173`

## Manual Run

### Backend

```bat
cd com.inn.cafe
mvnw.cmd spring-boot:run
```

### Frontend

```bat
cd Frontend
npm install
npm run dev
```

## Project Features

- Login/Signup with JWT authentication
- Dashboard with stats and chart
- Category management
- Product management (search/filter/sort)
- Billing (create order and generate PDF bill)
- Bills history (download/delete)

## Notes

- Frontend API URL defaults to `http://localhost:8082`
- If needed, set `VITE_API_URL` in `Frontend/.env`
