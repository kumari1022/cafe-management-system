export default function FormInput({ label, error, className = "", ...props }) {
  return (
    <div className="space-y-1">
      <label className="text-sm font-medium text-cafe-secondary">{label}</label>
      <input {...props} className={`cafe-input ${className}`} />
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}
