import React, { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function Block({ block, onUpdate, onDelete, dragHandleProps }) {
  const [editingTitle, setEditingTitle] = useState(false)
  const [title, setTitle] = useState(block.title || '')
  const [editingLeft, setEditingLeft] = useState(false)
  const [editingRight, setEditingRight] = useState(false)
  const [showExtrasOnly, setShowExtrasOnly] = useState(false)
  const [buttonsState, setButtonsState] = useState([false, false, false, false])

  const holdTimeout = useRef(null)
  const holdInterval = useRef(null)
  const holdStarted = useRef(false)

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
      }, 150)
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

  const updateExtra = (which, delta) => {
    const field = `extra${which}`
    update({ [field]: (block[field] ?? 0) + delta })
  }

  const toggleButton = (i) => {
    const newState = [...buttonsState]
    newState[i] = !newState[i]
    setButtonsState(newState)
  }

  return (
    <motion.div
      layout
      className="p-4 bg-white/90 dark:bg-neutral-800 rounded-2xl shadow-lg border border-gray-200 dark:border-neutral-700"
      transition={{ layout: { duration: 0.3, ease: 'easeInOut' } }}
    >
      {/* Header */}
      <div className="flex justify-between items-center gap-2">
        <div className="flex items-center gap-2">
          <div {...dragHandleProps} className="cursor-grab select-none px-2 py-1 rounded bg-gray-100 dark:bg-neutral-700 text-sm">
            ≡
          </div>

          {editingTitle ? (
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={commitTitle}
              onKeyDown={(e) => e.key === 'Enter' && commitTitle()}
              className="text-lg font-semibold bg-transparent border-b border-gray-300 dark:border-neutral-500 focus:outline-none"
            />
          ) : (
            <div
              onDoubleClick={() => setEditingTitle(true)}
              className="text-lg font-semibold text-gray-800 dark:text-gray-100"
            >
              {block.title || 'Giocatore'}
            </div>
          )}
        </div>

        <button
          onClick={() => onDelete(block.id)}
          className="text-xs px-2 py-1 rounded bg-red-600 text-white"
        >
          Elimina
        </button>
      </div>

      <AnimatePresence mode="wait">
        {!showExtrasOnly ? (
          // 🧱 Modalità normale
          <motion.div
            key="main"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {/* Contatori principali */}
            <div className="grid grid-cols-2 gap-4 mt-3">
              {['left', 'right'].map((side) => (
                <div key={side} className="flex flex-col items-center">
                  <div className="text-4xl font-bold">{block[side]}</div>
                  <div className="flex gap-2 mt-2">
                    <button
                      onPointerDown={() => startHold(side, -1)}
                      onPointerUp={stopHold}
                      onPointerLeave={stopHold}
                      onPointerCancel={stopHold}
                      onClick={() => handleClick(side, -1)}
                      className="px-3 py-1 rounded bg-gray-200 dark:bg-neutral-700 active:scale-95"
                    >
                      −
                    </button>
                    <button
                      onPointerDown={() => startHold(side, +1)}
                      onPointerUp={stopHold}
                      onPointerLeave={stopHold}
                      onPointerCancel={stopHold}
                      onClick={() => handleClick(side, +1)}
                      className="px-3 py-1 rounded bg-gray-200 dark:bg-neutral-700 active:scale-95"
                    >
                      +
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* 🔢 Mini contatori extra */}
            <div
              className="mt-4 flex justify-center gap-4 p-2 rounded-lg bg-gray-100 dark:bg-neutral-700 cursor-pointer hover:bg-gray-200 dark:hover:bg-neutral-600 transition"
              onClick={() => setShowExtrasOnly(true)}
            >
              <span className="text-lg font-semibold">{extra1}</span>
              <span className="text-lg font-semibold">{extra2}</span>
              <span className="text-lg font-semibold">{extra3}</span>
            </div>

            {/* 🎮 4 pulsanti immagine */}
            <div className="mt-4 grid grid-cols-4 gap-3">
              {buttonsState.map((active, i) => (
                <button
                  key={i}
                  onClick={() => toggleButton(i)}
                  className="flex items-center justify-center rounded-xl overflow-hidden shadow active:scale-95 transition"
                >
                  <img
                    src={active ? `public/icons/btn${i + 1}-on.png` : `public/icons/btn${i + 1}-off.png`}
                    alt={`button ${i + 1}`}
                    className="w-12 h-12 object-contain"
                  />
                </button>
              ))}
            </div>
          </motion.div>
        ) : (
          // ⚙️ Modalità extra dettagliata
          <motion.div
            key="extra"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <div className="mt-3 grid grid-cols-3 gap-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex flex-col items-center p-3 bg-gray-50 dark:bg-neutral-700 rounded-lg">
                  <div className="text-3xl font-bold">{block[`extra${i}`] ?? 0}</div>
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={() => updateExtra(i, -1)}
                      className="px-2 py-1 rounded bg-gray-200 dark:bg-neutral-600"
                    >
                      −
                    </button>
                    <button
                      onClick={() => updateExtra(i, +1)}
                      className="px-2 py-1 rounded bg-gray-200 dark:bg-neutral-600"
                    >
                      +
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => setShowExtrasOnly(false)}
              className="mt-3 text-sm text-blue-600 dark:text-blue-400 underline"
            >
              Torna ai contatori principali
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
