import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { motion, AnimatePresence } from "framer-motion";
import { Coffee, Home, ShoppingCart, Package, User, LogOut, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";

export default function UserNavbar() {
  const { logout } = useAuth();
  const location = useLocation();
  const [cartCount, setCartCount] = useState(0);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const updateCartCount = () => {
      try {
        const cart = JSON.parse(localStorage.getItem("cafe_cart")) || [];
        setCartCount(cart.reduce((total, item) => total + item.quantity, 0));
      } catch {
        setCartCount(0);
      }
    };
    updateCartCount();
    window.addEventListener("storage", updateCartCount);
    window.addEventListener("cartUpdated", updateCartCount);
    return () => {
      window.removeEventListener("storage", updateCartCount);
      window.removeEventListener("cartUpdated", updateCartCount);
    };
  }, []);

  const links = [
    { name: "Home", to: "/user/home", icon: Home },
    { name: "Menu", to: "/user/menu", icon: Coffee },
    { name: "Cart", to: "/user/cart", icon: ShoppingCart, badge: cartCount },
    { name: "My Orders", to: "/user/orders", icon: Package },
    { name: "Profile", to: "/user/profile", icon: User },
  ];

  return (
    <>
      <nav className="fixed top-4 left-1/2 -translate-x-1/2 w-[95%] max-w-7xl h-16 bg-white/80 backdrop-blur-xl shadow-cafe z-[60] px-5 sm:px-8 flex justify-between items-center rounded-2xl border border-white/50">
        {/* Logo */}
        <Link
          to="/user/home"
          className="flex items-center gap-2.5 text-cafe-primary font-display font-bold text-xl group flex-shrink-0"
        >
          <div className="p-1.5 bg-cafe-bg rounded-xl group-hover:scale-110 transition-transform border border-cafe-beige">
            <img
              src="/src/assets/logo.png"
              alt="Brew Haven Logo"
              className="w-7 h-7 object-contain"
            />
          </div>
          <span className="tracking-tight">Brew Haven</span>
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center gap-1">
          {links.map((L) => {
            const active = location.pathname === L.to || location.pathname.startsWith(L.to + "/");
            const Icon = L.icon;
            return (
              <Link
                key={L.to}
                to={L.to}
                className={`relative flex items-center gap-1.5 text-sm font-medium px-3 py-2 rounded-xl transition-all duration-200 ${
                  active
                    ? "text-cafe-primary bg-cafe-bg"
                    : "text-cafe-text/65 hover:text-cafe-primary hover:bg-cafe-bg/60"
                }`}
              >
                <Icon className="w-4 h-4" />
                {L.name}
                {L.badge > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full font-bold">
                    {L.badge > 9 ? "9+" : L.badge}
                  </span>
                )}
              </Link>
            );
          })}
          <button
            onClick={logout}
            className="flex items-center gap-1.5 text-sm font-medium text-cafe-text/65 hover:text-red-500 transition-colors ml-2 px-3 py-2 rounded-xl hover:bg-red-50"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>

        {/* Mobile — Cart icon + Hamburger */}
        <div className="flex md:hidden items-center gap-3">
          <Link to="/user/cart" className="relative text-cafe-text p-1">
            <ShoppingCart className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full font-bold">
                {cartCount > 9 ? "9+" : cartCount}
              </span>
            )}
          </Link>
          <button
            onClick={() => setMobileOpen((v) => !v)}
            className="p-1.5 rounded-xl bg-cafe-bg border border-cafe-beige text-cafe-text"
            aria-label="Toggle mobile menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile Dropdown Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="fixed top-24 left-1/2 -translate-x-1/2 w-[90%] max-w-sm bg-white/95 backdrop-blur-xl rounded-2xl shadow-cafe-lg border border-cafe-beige z-[59] p-3 flex flex-col gap-1 md:hidden"
          >
            {links.map((L) => {
              const active = location.pathname === L.to;
              const Icon = L.icon;
              return (
                <Link
                  key={L.to}
                  to={L.to}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                    active
                      ? "bg-cafe-bg text-cafe-primary font-semibold"
                      : "text-cafe-text/70 hover:bg-cafe-bg hover:text-cafe-primary"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {L.name}
                  {L.badge > 0 && (
                    <span className="ml-auto bg-red-500 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-bold">
                      {L.badge > 9 ? "9+" : L.badge}
                    </span>
                  )}
                </Link>
              );
            })}
            <div className="border-t border-cafe-beige mt-1 pt-1">
              <button
                onClick={logout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-colors"
              >
                <LogOut className="w-5 h-5" />
                Logout
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
