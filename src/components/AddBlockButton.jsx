import React from 'react'

export default function AddBlockButton({ onAdd }) {
  return (
    <button
      onClick={onAdd}
      className="w-full py-3 mt-3 rounded-lg border-2 border-dnd-brown/30 bg-gradient-to-r from-dnd-brown/5 to-white/10 text-dnd-brown dark:text-dnd-gold"
    >
      + Aggiungi blocco
    </button>
  )
}
