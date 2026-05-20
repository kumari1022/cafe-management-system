import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "../components/Navbar";
import { useAuth } from "../hooks/useAuth";
import { useDarkMode } from "../hooks/useDarkMode";

export default function AppShell({ title, sidebar }) {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { darkMode, setDarkMode } = useDarkMode();
  const [mobileOpen, setMobileOpen] = useState(false);

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <div className="min-h-screen bg-cafe-bg dark:bg-cafe-dark-bg">
      <Navbar
        title={title}
        onLogout={handleLogout}
        darkMode={darkMode}
        toggleDarkMode={() => setDarkMode(!darkMode)}
        onMenuClick={() => setMobileOpen(true)}
      />
      <div className="mx-auto flex max-w-[1400px]">
        <aside className="hidden md:block w-64 shrink-0 border-r border-[#e6d5c3] bg-cafe-sidebar dark:bg-cafe-dark-sidebar min-h-[calc(100vh-64px)]">
          {sidebar}
        </aside>

        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/40 md:hidden"
              onClick={() => setMobileOpen(false)}
            >
              <motion.aside
                initial={{ x: -280 }}
                animate={{ x: 0 }}
                exit={{ x: -280 }}
                onClick={(e) => e.stopPropagation()}
                className="h-full w-72 bg-cafe-sidebar dark:bg-cafe-dark-sidebar p-4 shadow-cafe-lg"
              >
                <div className="mb-4 flex justify-end">
                  <button onClick={() => setMobileOpen(false)} className="rounded-lg border p-2">
                    <X className="h-4 w-4" />
                  </button>
                </div>
                {sidebar}
              </motion.aside>
            </motion.div>
          )}
        </AnimatePresence>

        <main className="flex-1 p-4 md:p-6">
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
            <Outlet />
          </motion.div>
        </main>
      </div>
    </div>
  );
}
