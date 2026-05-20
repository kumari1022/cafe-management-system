import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Spinner from "../components/Spinner";
import { authService } from "../services/authService";
import { useAuth } from "../hooks/useAuth";
import { emailRegex, validateRequired } from "../utils/validators";
import { getRoleFromToken } from "../utils/jwt";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [remember, setRemember] = useState(true);
  const [showPass, setShowPass] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("rememberEmail");
    if (saved) setForm((f) => ({ ...f, email: saved }));
  }, []);

  function validate() {
    const next = {};
    if (!emailRegex.test(form.email)) next.email = "Enter valid email";
    if (!validateRequired(form.password)) next.password = "Password is required";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function onSubmit(e) {
    e.preventDefault();
    if (!validate()) return;
    try {
      setLoading(true);
      const { data } = await authService.login(form);
      const payload = typeof data === "string" ? JSON.parse(data) : data;
      login(payload.token);
      if (remember) localStorage.setItem("rememberEmail", form.email);
      else localStorage.removeItem("rememberEmail");
      const role = payload.role || getRoleFromToken(payload.token);
      toast.success("Welcome back to Brew Haven!");
      if (role === "admin") navigate("/admin/dashboard");
      else if (role === "staff") navigate("/staff/billing");
      else navigate("/user/home");
    } catch (error) {
      let msg = "Login failed";
      try {
        const raw = error?.response?.data;
        msg = typeof raw === "string" ? JSON.parse(raw).message : raw?.message || msg;
      } catch {
        /* ignore */
      }
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "linear-gradient(rgba(62,39,35,0.55), rgba(62,39,35,0.7)), url('https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1600&q=80')",
        }}
      />
      <div className="relative z-10 flex min-h-screen items-center justify-center p-4">
        <motion.form
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          onSubmit={onSubmit}
          className="glass-card w-full max-w-md space-y-5 p-8 text-white"
        >
          <div className="text-center">
            <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-cafe-primary text-3xl shadow-cafe-lg">
              ☕
            </div>
            <h1 className="font-display text-2xl font-bold">Welcome to Brew Haven Cafe</h1>
            <p className="mt-1 text-sm text-white/80">Sign in to your admin or staff account</p>
          </div>

          <div className="space-y-1">
            <label className="text-sm">Email</label>
            <input className="cafe-input text-cafe-text" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            {errors.email && <p className="text-xs text-red-200">{errors.email}</p>}
          </div>

          <div className="space-y-1">
            <label className="text-sm">Password</label>
            <div className="relative">
              <input
                type={showPass ? "text" : "password"}
                className="cafe-input pr-10 text-cafe-text"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
              <button type="button" className="absolute right-3 top-2.5 text-cafe-secondary" onClick={() => setShowPass(!showPass)}>
                {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.password && <p className="text-xs text-red-200">{errors.password}</p>}
          </div>

          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} />
            Remember me
          </label>

          <button disabled={loading} className="cafe-btn w-full py-3 text-base flex items-center justify-center gap-2">
            {loading ? <Spinner /> : "Sign In"}
          </button>
          
          <div className="text-center text-sm">
            <span className="text-white/80">Don't have an account? </span>
            <button type="button" onClick={() => navigate("/signup")} className="font-semibold text-cafe-primary hover:underline">
              Sign up
            </button>
          </div>
        </motion.form>
      </div>
    </div>
  );
}
