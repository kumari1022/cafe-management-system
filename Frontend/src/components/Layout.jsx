import { Outlet, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { useDarkMode } from "../hooks/useDarkMode";
import { useAuth } from "../hooks/useAuth";

export default function Layout() {
  const navigate = useNavigate();
  const { darkMode, setDarkMode } = useDarkMode();
  const { logout } = useAuth();

  function handleLogout() {
    logout();
    navigate("/login");
  }


  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Navbar onLogout={handleLogout} darkMode={darkMode} toggleDarkMode={() => setDarkMode(!darkMode)} />
      <div className="mx-auto flex max-w-7xl flex-col md:flex-row">
        <Sidebar />
        <main className="flex-1 p-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
