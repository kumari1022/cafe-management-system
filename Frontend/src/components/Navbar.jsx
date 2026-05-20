import { LogOut, Menu, Moon, Sun, User } from "lucide-react";
import { useAuth } from "../hooks/useAuth";

export default function Navbar({ title, onLogout, darkMode, toggleDarkMode, onMenuClick }) {
  const { role } = useAuth();

  return (
    <header className="sticky top-0 z-30 border-b border-[#e6d5c3] bg-cafe-card/90 backdrop-blur-md dark:bg-cafe-dark-card/90 dark:border-[#5c4033]">
      <div className="flex items-center justify-between px-4 py-3 md:px-6">
        <div className="flex items-center gap-3">
          <button type="button" className="md:hidden rounded-xl border border-[#dcc9b6] p-2" onClick={onMenuClick}>
            <Menu className="h-5 w-5" />
          </button>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cafe-bg p-1 shadow-sm overflow-hidden group-hover:scale-110 transition-transform">
            <img src="/src/assets/logo.png" alt="Logo" className="w-full h-full object-contain" />
          </div>
          <div>
            <p className="font-display text-lg font-semibold">Brew Haven Cafe</p>
            <p className="text-xs text-cafe-secondary">{title}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-2 rounded-full bg-cafe-sidebar px-3 py-1.5 text-sm dark:bg-cafe-dark-sidebar">
            <User className="h-4 w-4 text-cafe-primary" />
            <span className="capitalize">{role || "user"}</span>
          </div>
          <button type="button" onClick={toggleDarkMode} className="rounded-xl border border-[#dcc9b6] p-2 hover:bg-cafe-hover transition-colors">
            {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
          <button type="button" onClick={onLogout} className="rounded-xl border border-[#dcc9b6] p-2 hover:bg-red-50 hover:text-red-600 transition-colors">
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
