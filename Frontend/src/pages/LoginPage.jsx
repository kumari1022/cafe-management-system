import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import FormInput from "../components/FormInput";
import Spinner from "../components/Spinner";
import { authService } from "../services/authService";
import { emailRegex, validateRequired } from "../utils/validators";

export default function LoginPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

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
      localStorage.setItem("token", data.token);
      toast.success("Login successful");
      navigate("/dashboard");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <form onSubmit={onSubmit} className="card w-full max-w-md space-y-4 p-6">
        <h2 className="text-2xl font-semibold">Welcome back</h2>
        <FormInput label="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} error={errors.email} />
        <FormInput label="Password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} error={errors.password} />
        <button disabled={loading} className="w-full rounded-xl bg-brand-600 py-2 text-white">
          {loading ? <Spinner /> : "Login"}
        </button>
        <p className="text-sm text-slate-500">
          New user? <Link to="/signup" className="text-brand-600">Create account</Link>
        </p>
      </form>
    </div>
  );
}
