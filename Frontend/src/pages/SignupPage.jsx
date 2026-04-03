import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import FormInput from "../components/FormInput";
import Spinner from "../components/Spinner";
import { authService } from "../services/authService";
import { emailRegex, validatePhone, validateRequired } from "../utils/validators";

export default function SignupPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    contactNumber: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});

  function validate() {
    const next = {};
    if (!validateRequired(form.name)) next.name = "Name required";
    if (!emailRegex.test(form.email)) next.email = "Valid email required";
    if (!validatePhone(form.contactNumber)) next.contactNumber = "Valid phone required";
    if (!validateRequired(form.password)) next.password = "Password required";
    if (form.password !== form.confirmPassword) next.confirmPassword = "Passwords do not match";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function onSubmit(e) {
    e.preventDefault();
    if (!validate()) return;
    try {
      setLoading(true);
      await authService.signup({
        name: form.name,
        email: form.email,
        contactNumber: form.contactNumber,
        password: form.password,
      });
      toast.success("Signup successful. Please login.");
      navigate("/login");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <form onSubmit={onSubmit} className="card w-full max-w-md space-y-4 p-6">
        <h2 className="text-2xl font-semibold">Create account</h2>
        <FormInput label="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} error={errors.name} />
        <FormInput label="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} error={errors.email} />
        <FormInput label="Contact Number" value={form.contactNumber} onChange={(e) => setForm({ ...form, contactNumber: e.target.value })} error={errors.contactNumber} />
        <FormInput label="Password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} error={errors.password} />
        <FormInput label="Confirm Password" type="password" value={form.confirmPassword} onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })} error={errors.confirmPassword} />
        <button disabled={loading} className="w-full rounded-xl bg-brand-600 py-2 text-white">
          {loading ? <Spinner /> : "Signup"}
        </button>
        <p className="text-sm text-slate-500">
          Already have an account? <Link to="/login" className="text-brand-600">Login</Link>
        </p>
      </form>
    </div>
  );
}
