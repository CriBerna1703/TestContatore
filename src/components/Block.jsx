import React from 'react'

export default function Block({ block, onUpdate, onDelete }) {
  const update = (changes) => onUpdate({ ...block, ...changes })

  return (
    <div className="p-3 bg-white rounded-lg shadow-sm flex flex-col gap-3">
      <div className="flex justify-between items-center">
        <div className="text-sm font-semibold">{block.title || 'Giocatore'}</div>
        <button onClick={() => onDelete(block.id)} className="text-sm text-red-500">Elimina</button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col items-center">
          <div className="text-2xl font-bold">{block.left}</div>
          <div className="flex gap-2 mt-2">
            <button onClick={() => update({ left: block.left - 1 })} className="px-3 py-1 rounded bg-gray-200">−</button>
            <button onClick={() => update({ left: block.left + 1 })} className="px-3 py-1 rounded bg-gray-200">+</button>
          </div>
        </div>

        <div className="flex flex-col items-center">
          <div className="text-2xl font-bold">{block.right}</div>
          <div className="flex gap-2 mt-2">
            <button onClick={() => update({ right: block.right - 1 })} className="px-3 py-1 rounded bg-gray-200">−</button>
            <button onClick={() => update({ right: block.right + 1 })} className="px-3 py-1 rounded bg-gray-200">+</button>
          </div>
        </div>
      </div>

      <div className="flex gap-2">
        <button onClick={() => update({ left:0, right:0 })} className="flex-1 py-1 rounded bg-gray-100">Reset</button>
        <button onClick={() => { update({ left: block.left + 1, right: block.right + 1 }) }} className="flex-1 py-1 rounded bg-gray-100">+ Entrambi</button>
      </div>
    </div>
  )
}
