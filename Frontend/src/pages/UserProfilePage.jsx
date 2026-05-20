import { useState, useEffect } from "react";
import { User, Lock } from "lucide-react";
import { authService } from "../services/authService";
import toast from "react-hot-toast";
import Spinner from "../components/Spinner";
import { jwtDecode } from "jwt-decode";

export default function UserProfilePage() {
  const [form, setForm] = useState({ oldPassword: "", newPassword: "" });
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");

  useEffect(() => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        const decoded = jwtDecode(token);
        setEmail(decoded.sub || decoded.email || "Customer");
      }
    } catch {}
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.oldPassword || !form.newPassword) {
      return toast.error("Please fill all fields");
    }
    
    try {
      setLoading(true);
      const res = await authService.changePassword(form);
      toast.success(res.data?.message || "Password changed successfully");
      setForm({ oldPassword: "", newPassword: "" });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to change password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-cafe-beige flex items-center gap-6">
        <div className="w-24 h-24 bg-cafe-beige rounded-full flex items-center justify-center text-4xl text-cafe-primary">
          <User />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-cafe-text">My Profile</h2>
          <p className="text-cafe-text/60">{email}</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl p-8 shadow-sm border border-cafe-beige">
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-cafe-beige">
          <Lock className="text-cafe-primary w-6 h-6" />
          <h3 className="text-xl font-bold text-cafe-text">Change Password</h3>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
          <div>
            <label className="block text-sm font-medium text-cafe-text/80 mb-1">Current Password</label>
            <input
              type="password"
              className="cafe-input"
              value={form.oldPassword}
              onChange={e => setForm({...form, oldPassword: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-cafe-text/80 mb-1">New Password</label>
            <input
              type="password"
              className="cafe-input"
              value={form.newPassword}
              onChange={e => setForm({...form, newPassword: e.target.value})}
            />
          </div>
          <button disabled={loading} type="submit" className="cafe-btn w-full mt-4 flex justify-center">
            {loading ? <Spinner /> : "Update Password"}
          </button>
        </form>
      </div>
    </div>
  );
}
