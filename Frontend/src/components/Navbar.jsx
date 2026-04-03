import { LogOut, Moon, Sun } from "lucide-react";

export default function Navbar({ onLogout, darkMode, toggleDarkMode }) {
  return (
    <header className="sticky top-0 z-10 border-b border-slate-100 bg-white/80 backdrop-blur-md dark:bg-slate-900">
      <div className="flex items-center justify-between px-4 py-3">
        <h1 className="text-lg font-semibold text-slate-800 dark:text-slate-100">Cafe Management</h1>
        <div className="flex items-center gap-2">
          <button onClick={toggleDarkMode} className="rounded-xl border border-slate-200 p-2">
            {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
          <button onClick={onLogout} className="rounded-xl border border-slate-200 p-2">
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
