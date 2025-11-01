import React, { useState, useRef } from 'react'

export default function Block({ block, onUpdate, onDelete, dragHandleProps }) {
  const [editingTitle, setEditingTitle] = useState(false)
  const [title, setTitle] = useState(block.title || '')
  const [editingLeft, setEditingLeft] = useState(false)
  const [editingRight, setEditingRight] = useState(false)
  const [showExtrasOnly, setShowExtrasOnly] = useState(false)

  const holdTimeout = useRef(null)
  const holdInterval = useRef(null)
  const holdStarted = useRef(false)

  // inizializza valori extra se non esistono
  const { extra1 = 0, extra2 = 0, extra3 = 0 } = block

  const commitTitle = () => {
    setEditingTitle(false)
    onUpdate({ ...block, title: title || 'Giocatore' })
  }

  const update = (changes) => onUpdate({ ...block, ...changes })

  const startHold = (side, delta) => {
    holdStarted.current = false
    holdTimeout.current = setTimeout(() => {
      holdStarted.current = true
      holdInterval.current = setInterval(() => {
        if (side === 'left') update({ left: block.left + delta * 5 })
        else if (side === 'right') update({ right: block.right + delta * 5 })
      }, 200)
    }, 500)
  }

  const stopHold = () => {
    clearTimeout(holdTimeout.current)
    clearInterval(holdInterval.current)
  }

  const handleClick = (side, delta) => {
    if (holdStarted.current) {
      holdStarted.current = false
      return
    }
    if (side === 'left') update({ left: block.left + delta })
    else if (side === 'right') update({ right: block.right + delta })
  }

  // Funzioni per i contatori extra
  const updateExtra = (which, delta) => {
    const field = `extra${which}`
    update({ [field]: (block[field] ?? 0) + delta })
  }

  return (
    <div className="p-3 bg-white rounded-xl shadow-md border border-gray-200">
      {/* Header */}
      <div className="flex justify-between items-center gap-2">
        <div className="flex items-center gap-2">
          <div {...dragHandleProps} className="cursor-grab select-none px-2 py-1 rounded bg-gray-100 text-sm">
            ≡
          </div>

          {editingTitle ? (
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={commitTitle}
              onKeyDown={(e) => e.key === 'Enter' && commitTitle()}
              className="text-lg font-semibold bg-transparent border-b border-gray-300 focus:outline-none"
            />
          ) : (
            <div
              onDoubleClick={() => setEditingTitle(true)}
              className="text-lg font-semibold text-gray-800"
            >
              {block.title || 'Giocatore'}
            </div>
          )}
        </div>

        <button onClick={() => onDelete(block.id)} className="text-xs px-2 py-1 rounded bg-red-600 text-white">
          Elimina
        </button>
      </div>

      {/* Contenuto variabile */}
      {showExtrasOnly ? (
        // --- Modalità dettagliata ---
        <div className="mt-3 grid grid-cols-3 gap-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex flex-col items-center p-2 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold">{block[`extra${i}`] ?? 0}</div>
              <div className="flex gap-2 mt-1">
                <button
                  onClick={() => updateExtra(i, -1)}
                  className="px-2 py-1 rounded bg-gray-200"
                >
                  −
                </button>
                <button
                  onClick={() => updateExtra(i, +1)}
                  className="px-2 py-1 rounded bg-gray-200"
                >
                  +
                </button>
              </div>
            </div>
          ))}
          <button
            onClick={() => setShowExtrasOnly(false)}
            className="col-span-3 mt-3 text-sm text-blue-600 underline"
          >
            Torna ai contatori principali
          </button>
        </div>
      ) : (
        // --- Modalità normale ---
        <>
          {/* Contatori principali */}
          <div className="grid grid-cols-2 gap-4 mt-3">
            <div className="flex flex-col items-center">
              <div className="text-3xl font-bold">{block.left}</div>
              <div className="flex gap-2 mt-2">
                <button
                  onPointerDown={() => startHold('left', -1)}
                  onPointerUp={stopHold}
                  onPointerLeave={stopHold}
                  onPointerCancel={stopHold}
                  onClick={() => handleClick('left', -1)}
                  className="px-3 py-1 rounded bg-gray-200"
                >
                  −
                </button>
                <button
                  onPointerDown={() => startHold('left', +1)}
                  onPointerUp={stopHold}
                  onPointerLeave={stopHold}
                  onPointerCancel={stopHold}
                  onClick={() => handleClick('left', +1)}
                  className="px-3 py-1 rounded bg-gray-200"
                >
                  +
                </button>
              </div>
            </div>

            <div className="flex flex-col items-center">
              <div className="text-3xl font-bold">{block.right}</div>
              <div className="flex gap-2 mt-2">
                <button
                  onPointerDown={() => startHold('right', -1)}
                  onPointerUp={stopHold}
                  onPointerLeave={stopHold}
                  onPointerCancel={stopHold}
                  onClick={() => handleClick('right', -1)}
                  className="px-3 py-1 rounded bg-gray-200"
                >
                  −
                </button>
                <button
                  onPointerDown={() => startHold('right', +1)}
                  onPointerUp={stopHold}
                  onPointerLeave={stopHold}
                  onPointerCancel={stopHold}
                  onClick={() => handleClick('right', +1)}
                  className="px-3 py-1 rounded bg-gray-200"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* Mini contatori extra */}
          <div
            className="mt-4 flex justify-center gap-4 p-2 rounded bg-gray-100 cursor-pointer"
            onClick={() => setShowExtrasOnly(true)}
          >
            <span className="text-lg font-semibold">{extra1}</span>
            <span className="text-lg font-semibold">{extra2}</span>
            <span className="text-lg font-semibold">{extra3}</span>
          </div>
        </>
      )}
    </div>
  )
}
