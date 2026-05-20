import AppShell from "./AppShell";
import AdminSidebar from "../components/AdminSidebar";

export default function AdminLayout() {
  return <AppShell title="Admin Dashboard" sidebar={<AdminSidebar />} />;
}
