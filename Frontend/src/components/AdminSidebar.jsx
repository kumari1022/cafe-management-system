import { NavLink } from "react-router-dom";

const links = [
  { to: "/admin/dashboard", label: "Dashboard", icon: "☕" },
  { to: "/admin/staff", label: "Staff", icon: "👨‍🍳" },
  { to: "/admin/categories", label: "Categories", icon: "🥐" },
  { to: "/admin/products", label: "Products", icon: "🍰" },
  { to: "/admin/billing", label: "Walk-in Billing", icon: "🧾" },
  { to: "/admin/bills", label: "Walk-in Bills", icon: "📜" },
  { to: "/admin/orders", label: "Online Orders", icon: "🛒" },
  { to: "/admin/reviews", label: "Reviews", icon: "⭐" },
  { to: "/admin/change-password", label: "Change Password", icon: "🔐" },
];

export default function AdminSidebar() {
  return (
    <nav className="space-y-1">
      {links.map((link) => (
        <NavLink
          key={link.to}
          to={link.to}
          className={({ isActive }) =>
            `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
              isActive
                ? "bg-cafe-primary text-white shadow-cafe scale-[1.02]"
                : "text-cafe-text hover:bg-cafe-hover dark:text-cafe-dark-text"
            }`
          }
        >
          <span className="text-lg">{link.icon}</span>
          {link.label}
        </NavLink>
      ))}
    </nav>
  );
}
