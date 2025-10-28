import React, { useState, useRef, useEffect } from 'react'

export default function Block({ block, onUpdate, onDelete, dragHandleProps }) {
  const [editingTitle, setEditingTitle] = useState(false)
  const [title, setTitle] = useState(block.title || '')
  const [editingLeft, setEditingLeft] = useState(false)
  const [editingRight, setEditingRight] = useState(false)

  const holdTimeout = useRef(null)
  const holdInterval = useRef(null)
  const holdStarted = useRef(false)

  // Refs per valori aggiornati
  const leftRef = useRef(block.left)
  const rightRef = useRef(block.right)
  useEffect(() => { leftRef.current = block.left }, [block.left])
  useEffect(() => { rightRef.current = block.right }, [block.right])

  const commitTitle = () => {
    setEditingTitle(false)
    onUpdate({ ...block, title: title || 'Giocatore' })
  }

  const update = (changes) => onUpdate({ ...block, ...changes })

  // Gestione press-and-hold
  const startHold = (side, delta) => {
    holdStarted.current = false
    holdTimeout.current = setTimeout(() => {
      holdStarted.current = true
      holdInterval.current = setInterval(() => {
        const step = delta * 5
        if (side === 'left') update({ left: leftRef.current + step })
        else update({ right: rightRef.current + step })
      }, 500)
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
    // click singolo incrementa solo di 1
    if (side === 'left') update({ left: leftRef.current + delta })
    else update({ right: rightRef.current + delta })
  }

  const handleManualInput = (side, value) => {
    const num = parseInt(value, 10)
    if (!isNaN(num)) {
      if (side === 'left') update({ left: num })
      else update({ right: num })
    }
  }

  return (
    <div className="p-4 bg-white dark:bg-[#2c2c2c] rounded-3xl shadow-lg border border-gray-200 dark:border-gray-700">
      {/* Header */}
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-3">
          <div {...dragHandleProps} className="cursor-grab px-2 py-1 rounded bg-gray-300 dark:bg-gray-600 text-sm select-none">≡</div>
          {editingTitle ? (
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={commitTitle}
              onKeyDown={(e) => e.key === 'Enter' && commitTitle()}
              className="text-lg font-semibold bg-transparent border-b border-gray-400 dark:border-gray-500 focus:outline-none"
            />
          ) : (
            <div
              onDoubleClick={() => setEditingTitle(true)}
              className="text-lg font-semibold font-fantasy text-gray-800 dark:text-gray-100 select-none"
            >
              {block.title || 'Giocatore'}
            </div>
          )}
        </div>
        <button
          onClick={() => onDelete(block.id)}
          className="text-xs px-3 py-1 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors"
        >
          Elimina
        </button>
      </div>

      {/* Contatori */}
      <div className="grid grid-cols-2 gap-6">
        {/* Sinistra */}
        <div className="flex flex-col items-center">
          {editingLeft ? (
            <input
              type="number"
              defaultValue={block.left}
              autoFocus
              onBlur={(e) => { handleManualInput('left', e.target.value); setEditingLeft(false) }}
              onKeyDown={(e) => { if(e.key==='Enter'){ handleManualInput('left', e.target.value); setEditingLeft(false)}}}
              className="text-4xl font-bold text-center bg-gray-100 dark:bg-gray-800 rounded-lg w-20 border border-gray-300 dark:border-gray-600"
            />
          ) : (
            <div
              onDoubleClick={() => setEditingLeft(true)}
              className="text-4xl font-bold cursor-pointer select-none text-gray-900 dark:text-gray-100"
            >
              {block.left}
            </div>
          )}
          <div className="flex gap-3 mt-3">
            <button
              onPointerDown={() => startHold('left', -1)}
              onPointerUp={stopHold} onPointerLeave={stopHold} onPointerCancel={stopHold}
              onClick={() => handleClick('left', -1)}
              className="w-12 h-12 rounded-full bg-red-300 dark:bg-red-600 text-xl font-bold flex items-center justify-center hover:bg-red-400 dark:hover:bg-red-500 active:scale-95 transition"
            >−</button>
            <button
              onPointerDown={() => startHold('left', +1)}
              onPointerUp={stopHold} onPointerLeave={stopHold} onPointerCancel={stopHold}
              onClick={() => handleClick('left', +1)}
              className="w-12 h-12 rounded-full bg-green-300 dark:bg-green-600 text-xl font-bold flex items-center justify-center hover:bg-green-400 dark:hover:bg-green-500 active:scale-95 transition"
            >+</button>
          </div>
        </div>

        {/* Destra */}
        <div className="flex flex-col items-center">
          {editingRight ? (
            <input
              type="number"
              defaultValue={block.right}
              autoFocus
              onBlur={(e) => { handleManualInput('right', e.target.value); setEditingRight(false) }}
              onKeyDown={(e) => { if(e.key==='Enter'){ handleManualInput('right', e.target.value); setEditingRight(false)}}}
              className="text-4xl font-bold text-center bg-gray-100 dark:bg-gray-800 rounded-lg w-20 border border-gray-300 dark:border-gray-600"
            />
          ) : (
            <div
              onDoubleClick={() => setEditingRight(true)}
              className="text-4xl font-bold cursor-pointer select-none text-gray-900 dark:text-gray-100"
            >
              {block.right}
            </div>
          )}
          <div className="flex gap-3 mt-3">
            <button
              onPointerDown={() => startHold('right', -1)}
              onPointerUp={stopHold} onPointerLeave={stopHold} onPointerCancel={stopHold}
              onClick={() => handleClick('right', -1)}
              className="w-12 h-12 rounded-full bg-red-300 dark:bg-red-600 text-xl font-bold flex items-center justify-center hover:bg-red-400 dark:hover:bg-red-500 active:scale-95 transition"
            >−</button>
            <button
              onPointerDown={() => startHold('right', +1)}
              onPointerUp={stopHold} onPointerLeave={stopHold} onPointerCancel={stopHold}
              onClick={() => handleClick('right', +1)}
              className="w-12 h-12 rounded-full bg-green-300 dark:bg-green-600 text-xl font-bold flex items-center justify-center hover:bg-green-400 dark:hover:bg-green-500 active:scale-95 transition"
            >+</button>
          </div>
        </div>
      </div>
    </div>
  )
}
