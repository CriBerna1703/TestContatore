import React from 'react'

export default function AddBlockButton({ onAdd }) {
  return (
    <button
      onClick={onAdd}
      className="w-full py-2 mt-3 rounded-lg border border-dashed border-gray-300"
    >
      + Aggiungi blocco
    </button>
  )
}
