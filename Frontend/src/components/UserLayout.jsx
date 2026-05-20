import { Outlet } from "react-router-dom";
import UserNavbar from "../components/UserNavbar";

export default function UserLayout() {
  return (
    <div className="min-h-screen bg-cafe-bg flex flex-col font-sans">
      <UserNavbar />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-8">
        <Outlet />
      </main>
    </div>
  );
}
