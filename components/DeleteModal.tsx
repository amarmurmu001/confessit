import { motion, AnimatePresence } from 'framer-motion'

type DeleteModalProps = {
  isOpen: boolean
  onDelete: () => void
  onCancel: () => void
}

export default function DeleteModal({ isOpen, onDelete, onCancel }: DeleteModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-pink-900/20 backdrop-blur-sm z-50"
            onClick={onCancel}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-xl shadow-lg z-50 w-full max-w-md border border-pink-100"
          >
            <h3 className="text-xl font-medium text-pink-600 mb-4">Delete Confession</h3>
            <p className="text-pink-600/60 mb-6">
              Are you sure you want to delete this confession? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                className="px-4 py-2 rounded-lg text-pink-600/60 hover:bg-pink-50 transition-colors"
                onClick={onCancel}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 rounded-lg bg-pink-600 text-white hover:bg-pink-700 transition-colors"
                onClick={onDelete}
              >
                Delete
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
  