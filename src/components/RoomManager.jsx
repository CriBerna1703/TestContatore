import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function RoomManager({ rooms, onLoadRoom }) {
  const [showModal, setShowModal] = useState(false)
  const [selectedRoom, setSelectedRoom] = useState(null)

  const handleClick = (room) => {
    setSelectedRoom(room)
    setShowModal(true)
  }

  const confirmLoad = () => {
    onLoadRoom(selectedRoom)
    setShowModal(false)
    setSelectedRoom(null)
  }

  return (
    <div className="bg-white/80 dark:bg-neutral-800/80 rounded-xl p-3 shadow-md mb-4">
      <h2 className="text-lg font-semibold mb-2 text-gray-700 dark:text-gray-200">
        Stanze predefinite
      </h2>

      <div className="flex flex-wrap gap-2">
        {rooms.map((r) => (
          <div
            key={r.name}
            onClick={() => handleClick(r)}
            className="px-3 py-1 rounded-lg bg-gray-100 dark:bg-neutral-700 hover:bg-gray-200 dark:hover:bg-neutral-600 cursor-pointer transition"
          >
            {r.name}
          </div>
        ))}
      </div>

      <AnimatePresence>
        {showModal && (
          <motion.div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white dark:bg-neutral-800 p-6 rounded-xl shadow-lg"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <h3 className="text-lg font-semibold mb-2">
                Sostituire l’attuale configurazione con "{selectedRoom?.name}"?
              </h3>
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-3 py-1 rounded bg-gray-300 dark:bg-neutral-700"
                >
                  Annulla
                </button>
                <button
                  onClick={confirmLoad}
                  className="px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700"
                >
                  Conferma
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
