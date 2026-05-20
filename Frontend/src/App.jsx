import { Navigate, Route, Routes } from "react-router-dom";
import RoleRoute from "./routes/RoleRoute";
import AdminLayout from "./layouts/AdminLayout";
import StaffLayout from "./layouts/StaffLayout";
import Spinner from "./components/Spinner";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import CategoryPage from "./pages/CategoryPage";
import ProductPage from "./pages/ProductPage";
import BillingPage from "./pages/BillingPage";
import BillsHistoryPage from "./pages/BillsHistoryPage";
import StaffManagementPage from "./pages/StaffManagementPage";
import ChangePasswordPage from "./pages/ChangePasswordPage";
import SignupPage from "./pages/SignupPage";
import UserLayout from "./layouts/UserLayout";
import UserHomePage from "./pages/UserHomePage";
import UserMenuPage from "./pages/UserMenuPage";
import UserCartPage from "./pages/UserCartPage";
import UserOrdersPage from "./pages/UserOrdersPage";
import UserProfilePage from "./pages/UserProfilePage";
import OrderManagementPage from "./pages/OrderManagementPage";
import ReviewManagementPage from "./pages/ReviewManagementPage";
import { useAuth } from "./hooks/useAuth";

export default function App() {
  const { isAuthenticated, isAdmin, isStaff, isUser, booting } = useAuth();

  if (booting) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cafe-bg">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route
        path="/login"
        element={
          isAuthenticated ? (
            <Navigate to={isAdmin ? "/admin/dashboard" : isStaff ? "/staff/billing" : "/user/home"} replace />
          ) : (
            <LoginPage />
          )
        }
      />
      
      <Route
        path="/signup"
        element={
          isAuthenticated ? (
            <Navigate to={isAdmin ? "/admin/dashboard" : isStaff ? "/staff/billing" : "/user/home"} replace />
          ) : (
            <SignupPage />
          )
        }
      />

      <Route
        path="/user"
        element={
          <RoleRoute allowedRoles={["user"]}>
            <UserLayout />
          </RoleRoute>
        }
      >
        <Route index element={<Navigate to="home" replace />} />
        <Route path="home" element={<UserHomePage />} />
        <Route path="menu" element={<UserMenuPage />} />
        <Route path="cart" element={<UserCartPage />} />
        <Route path="orders" element={<UserOrdersPage />} />
        <Route path="profile" element={<UserProfilePage />} />
      </Route>

      <Route
        path="/admin"
        element={
          <RoleRoute allowedRoles={["admin"]}>
            <AdminLayout />
          </RoleRoute>
        }
      >
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="staff" element={<StaffManagementPage />} />
        <Route path="categories" element={<CategoryPage />} />
        <Route path="products" element={<ProductPage />} />
        <Route path="billing" element={<BillingPage />} />
        <Route path="bills" element={<BillsHistoryPage />} />
        <Route path="orders" element={<OrderManagementPage />} />
        <Route path="reviews" element={<ReviewManagementPage />} />
        <Route path="change-password" element={<ChangePasswordPage />} />
      </Route>

      <Route
        path="/staff"
        element={
          <RoleRoute allowedRoles={["staff"]}>
            <StaffLayout />
          </RoleRoute>
        }
      >
        <Route index element={<Navigate to="billing" replace />} />
        <Route path="billing" element={<BillingPage />} />
        <Route path="bills" element={<BillsHistoryPage />} />
        <Route path="orders" element={<OrderManagementPage />} />
        <Route path="change-password" element={<ChangePasswordPage />} />
      </Route>

      <Route
        path="*"
        element={
          <Navigate
            to={!isAuthenticated ? "/login" : isAdmin ? "/admin/dashboard" : isStaff ? "/staff/billing" : isUser ? "/user/home" : "/login"}
            replace
          />
        }
      />
    </Routes>
  );
}
