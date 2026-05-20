import { useState } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Spinner from "../components/Spinner";
import { authService } from "../services/authService";
import { emailRegex, validateRequired, validatePhone } from "../utils/validators";

export default function SignupPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", contactNumber: "", password: "" });
  const [showPass, setShowPass] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  function validate() {
    const next = {};
    if (!validateRequired(form.name)) next.name = "Name is required";
    if (!emailRegex.test(form.email)) next.email = "Enter valid email";
    if (!validatePhone(form.contactNumber)) next.contactNumber = "Enter 10 digit number";
    if (!validateRequired(form.password)) next.password = "Password is required";
    else if (form.password.length < 6) next.password = "Minimum 6 characters";
    
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function onSubmit(e) {
    e.preventDefault();
    if (!validate()) return;
    try {
      setLoading(true);
      await authService.signup(form);
      toast.success("Successfully registered! Please login.");
      navigate("/login");
    } catch (error) {
      let msg = "Registration failed";
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
            "linear-gradient(rgba(62,39,35,0.65), rgba(62,39,35,0.8)), url('https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=1600&q=80')",
        }}
      />
      <div className="relative z-10 flex min-h-screen items-center justify-center p-4">
        <motion.form
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          onSubmit={onSubmit}
          className="glass-card w-full max-w-md space-y-5 p-8 text-white"
        >
          <div className="text-center">
            <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-cafe-primary text-2xl shadow-cafe-lg">
              ✨
            </div>
            <h1 className="font-display text-2xl font-bold">Join Brew Haven</h1>
            <p className="mt-1 text-sm text-white/80">Create your customer account</p>
          </div>

          <div className="space-y-1">
            <label className="text-sm">Name</label>
            <input className="cafe-input text-cafe-text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            {errors.name && <p className="text-xs text-red-200">{errors.name}</p>}
          </div>

          <div className="space-y-1">
            <label className="text-sm">Email</label>
            <input className="cafe-input text-cafe-text" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            {errors.email && <p className="text-xs text-red-200">{errors.email}</p>}
          </div>

          <div className="space-y-1">
            <label className="text-sm">Phone Number</label>
            <input className="cafe-input text-cafe-text" value={form.contactNumber} onChange={(e) => setForm({ ...form, contactNumber: e.target.value })} />
            {errors.contactNumber && <p className="text-xs text-red-200">{errors.contactNumber}</p>}
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

          <button disabled={loading} className="cafe-btn w-full py-3 text-base flex items-center justify-center gap-2">
            {loading ? <Spinner /> : "Create Account"}
          </button>
          
          <div className="text-center text-sm mt-4">
            <span className="text-white/80">Already have an account? </span>
            <button type="button" onClick={() => navigate("/login")} className="font-semibold text-cafe-primary hover:underline">
              Sign in
            </button>
          </div>
        </motion.form>
      </div>
    </div>
  );
}
