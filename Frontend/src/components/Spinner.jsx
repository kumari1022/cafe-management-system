export default function Spinner({ size = "md" }) {
  const sizes = { sm: "h-4 w-4", md: "h-5 w-5", lg: "h-10 w-10" };
  return (
    <div
      className={`${sizes[size] || sizes.md} rounded-full border-2 border-cafe-hover border-t-cafe-primary animate-spin`}
      role="status"
      aria-label="Loading"
    />
  );
}
