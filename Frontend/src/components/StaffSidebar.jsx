import { NavLink } from "react-router-dom";

const links = [
  { to: "/staff/billing", label: "Walk-in Billing", icon: "🧾" },
  { to: "/staff/bills", label: "Walk-in Bills", icon: "📜" },
  { to: "/staff/orders", label: "Online Orders", icon: "🛒" },
  { to: "/staff/change-password", label: "Change Password", icon: "🔐" },
];

export default function StaffSidebar() {
  return (
    <nav className="space-y-1">
      {links.map((link) => (
        <NavLink
          key={link.to}
          to={link.to}
          className={({ isActive }) =>
            `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
              isActive
                ? "bg-cafe-primary text-white shadow-cafe"
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
