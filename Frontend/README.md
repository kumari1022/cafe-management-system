# Cafe Management Frontend (React + Vite)

This is the React frontend for your Cafe Management System.

It connects to the existing Spring Boot backend APIs (`http://localhost:8082` by default).

## Tech Stack

- React (functional components + hooks)
- Vite
- Tailwind CSS
- React Router
- Axios
- React Hot Toast
- Recharts
- Lucide React

## 1) Prerequisites

- Node.js (LTS recommended)
- npm
- Spring Boot backend running on port `8082`

## 2) Install and Run

```bash
npm install
npm run dev
```

Open the app in browser (Vite will show the URL, usually `http://localhost:5173`).

## 3) Build for Production

```bash
npm run build
npm run preview
```

## 4) API Configuration

The app reads API URL from:

- `VITE_API_URL` (if provided)
- fallback: `http://localhost:8082`

To set custom API URL, create a `.env` file in `Frontend`:

```env
VITE_API_URL=http://localhost:8082
```

## 5) Authentication

- JWT token is saved in `localStorage` under key: `token`
- Axios interceptor automatically adds:
  - `Authorization: Bearer <token>`
- On `401`, token is removed and user is redirected to login

## 6) Main Routes

- `/login` -> Login page
- `/signup` -> Signup page
- `/dashboard` -> Dashboard stats + chart
- `/categories` -> Category management
- `/products` -> Product management (search/filter/sort)
- `/billing` -> Create order + generate bill PDF
- `/bills` -> Bills history + download/delete

## 7) Project Structure

```text
src/
  components/   # Reusable UI components (layout, table, input, spinner)
  pages/        # Page components
  services/     # Axios + API services
  hooks/        # Custom hooks (auth, dark mode)
  utils/        # Helper functions and validators
  App.jsx
  main.jsx
  index.css
```

## 8) Useful Commands

```bash
npm run dev      # Start development server
npm run build    # Create production build
npm run preview  # Preview production build locally
```

## 9) Notes for Beginners

- Start from `src/App.jsx` to understand routing.
- Check `src/services/api.js` to see API and JWT interceptor setup.
- Reusable UI pieces are in `src/components`.
- Business pages are in `src/pages`.

