import AppShell from "./AppShell";
import StaffSidebar from "../components/StaffSidebar";

export default function StaffLayout() {
  return <AppShell title="Staff POS" sidebar={<StaffSidebar />} />;
}
