export default function PageHeader({ title, subtitle }) {
  return (
    <div className="mb-2">
      <h2 className="font-display text-2xl font-bold text-cafe-text dark:text-cafe-dark-text">{title}</h2>
      {subtitle && <p className="text-sm text-cafe-secondary">{subtitle}</p>}
    </div>
  );
}
