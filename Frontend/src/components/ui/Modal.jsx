import { motion, AnimatePresence } from "framer-motion";

export default function Modal({ open, title, children, onClose, onConfirm, confirmText = "Confirm", danger }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="cafe-card w-full max-w-md p-6"
          >
            <h3 className="text-lg font-semibold">{title}</h3>
            <div className="mt-3 text-sm text-cafe-secondary">{children}</div>
            <div className="mt-6 flex justify-end gap-2">
              <button type="button" onClick={onClose} className="rounded-xl border px-4 py-2 text-sm">
                Cancel
              </button>
              {onConfirm && (
                <button
                  type="button"
                  onClick={onConfirm}
                  className={`rounded-xl px-4 py-2 text-sm text-white ${danger ? "bg-red-600 hover:bg-red-700" : "cafe-btn"}`}
                >
                  {confirmText}
                </button>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
