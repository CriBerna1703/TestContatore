import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import './RoomManager.css'

export default function RoomManager({ rooms, onLoadRoom, open, onClose }) {
  const [selectedRoom, setSelectedRoom] = useState(null)
  const [showModal, setShowModal] = useState(false)

  const handleRoomClick = (room) => {
    setSelectedRoom(room)
    setShowModal(true)
  }

  const confirmLoad = () => {
    onLoadRoom(selectedRoom)
    setShowModal(false)
    onClose()
  }

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.aside
            className="room-sidebar"
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', stiffness: 250, damping: 25 }}
          >
            <div className="room-header">
              <span>Stanze</span>
              <button className="room-close" onClick={onClose}>
                ✕
              </button>
            </div>

            <div className="room-list">
              {rooms.map((r) => (
                <div
                  key={r.name}
                  className="room-item"
                  onClick={() => handleRoomClick(r)}
                >
                  {r.name}
                </div>
              ))}
            </div>

            <div className="room-footer">Scorekeeper © 2025</div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Conferma caricamento stanza */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            className="room-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="room-modal"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
            >
              <h3>
                Sostituire la configurazione attuale con
                <br />
                “{selectedRoom?.name}”?
              </h3>
              <div className="room-modal-buttons">
                <button
                  className="room-cancel"
                  onClick={() => setShowModal(false)}
                >
                  Annulla
                </button>
                <button className="room-confirm" onClick={confirmLoad}>
                  Conferma
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
