export default function FormInput({ label, error, ...props }) {
  return (
    <div className="space-y-1">
      <label className="text-sm font-medium text-slate-600">{label}</label>
      <input
        {...props}
        className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-brand-500"
      />
      {error && <p className="text-xs text-rose-500">{error}</p>}
    </div>
  );
}
