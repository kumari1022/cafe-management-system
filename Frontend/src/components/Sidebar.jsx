import { BarChart3, ClipboardList, LayoutDashboard, Receipt, Shapes, Soup } from "lucide-react";
import { NavLink } from "react-router-dom";

const links = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/categories", label: "Categories", icon: Shapes },
  { to: "/products", label: "Products", icon: Soup },
  { to: "/billing", label: "Billing", icon: Receipt },
  { to: "/bills", label: "Bills History", icon: ClipboardList },
];

export default function Sidebar() {
  return (
    <aside className="w-full md:w-64 border-r border-slate-100 bg-white dark:bg-slate-900">
      <nav className="space-y-1 p-3">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `flex items-center gap-2 rounded-xl px-3 py-2 text-sm ${
                isActive ? "bg-brand-100 text-brand-600" : "text-slate-600 hover:bg-slate-100"
              }`
            }
          >
            <link.icon className="h-4 w-4" />
            {link.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
