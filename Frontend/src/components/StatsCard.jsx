import { motion } from "framer-motion";

export default function StatsCard({ title, value, icon, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      whileHover={{ scale: 1.03, y: -2 }}
      className="cafe-card p-5"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-cafe-secondary">{title}</p>
          <p className="mt-1 text-3xl font-bold text-cafe-text dark:text-cafe-dark-text">{value}</p>
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cafe-sidebar text-2xl dark:bg-cafe-dark-sidebar">
          {icon}
        </div>
      </div>
    </motion.div>
  );
}
