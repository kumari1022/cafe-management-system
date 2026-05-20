import { useState } from "react";
import toast from "react-hot-toast";
import FormInput from "../components/FormInput";
import PageHeader from "../components/PageHeader";
import Spinner from "../components/Spinner";
import { authService } from "../services/authService";
import { validateRequired } from "../utils/validators";

export default function ChangePasswordPage() {
  const [form, setForm] = useState({ oldPassword: "", newPassword: "", confirmPassword: "" });
  const [loading, setLoading] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    if (!validateRequired(form.oldPassword) || !validateRequired(form.newPassword)) {
      toast.error("Fill all fields");
      return;
    }
    if (form.newPassword !== form.confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }
    if (form.newPassword.length < 4) {
      toast.error("Password should be at least 4 characters");
      return;
    }
    try {
      setLoading(true);
      await authService.changePassword({
        oldPassword: form.oldPassword,
        newPassword: form.newPassword,
      });
      toast.success("Password changed");
      setForm({ oldPassword: "", newPassword: "", confirmPassword: "" });
    } catch (error) {
      toast.error(error?.response?.data?.message || "Could not change password");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-lg space-y-6">
      <PageHeader title="Change Password" subtitle="Keep your Brew Haven account secure" />
      <form onSubmit={onSubmit} className="cafe-card space-y-4 p-6">
        <FormInput label="Old Password" type="password" value={form.oldPassword} onChange={(e) => setForm({ ...form, oldPassword: e.target.value })} />
        <FormInput label="New Password" type="password" value={form.newPassword} onChange={(e) => setForm({ ...form, newPassword: e.target.value })} />
        <FormInput label="Confirm Password" type="password" value={form.confirmPassword} onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })} />
        <button type="submit" disabled={loading} className="cafe-btn w-full py-2.5">
          {loading ? <Spinner /> : "Update Password"}
        </button>
      </form>
    </div>
  );
}
