import React, { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
//import './Block.css'

export default function Block({ block, onUpdate, onDelete }) {
  const [editingTitle, setEditingTitle] = useState(false)
  const [title, setTitle] = useState(block.title || '')
  const [showExtrasOnly, setShowExtrasOnly] = useState(false)
  const [buttonsState, setButtonsState] = useState(block.buttonsState || [false, false, false, false])

  const holdTimeout = useRef(null)
  const holdInterval = useRef(null)
  const holdStarted = useRef(false)

  const { left = 0, right = 0, extra1 = 0, extra2 = 0, extra3 = 0 } = block

  const update = (changes) => onUpdate({ ...block, ...changes })

  const startHold = (side, delta) => {
    holdStarted.current = false
    holdTimeout.current = setTimeout(() => {
      holdStarted.current = true
      holdInterval.current = setInterval(() => {
        onUpdate(prev => {
          if (prev.id !== block.id) return prev
          const key = side
          return { ...prev, [key]: (prev[key] ?? 0) + delta * 5 }
        })
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
    update({ [side]: (block[side] ?? 0) + delta })
  }

  const toggleButton = (i) => {
    const newState = [...buttonsState]
    newState[i] = !newState[i]
    setButtonsState(newState)
    update({ buttonsState: newState })
  }

  const updateExtra = (i, delta) => {
    const key = `extra${i}`
    update({ [key]: (block[key] ?? 0) + delta })
  }

  const commitTitle = () => {
    setEditingTitle(false)
    update({ title: title || 'Giocatore' })
  }

  return (
    <motion.div layout className="block-container">
      {/* HEADER */}
      <div className="block-header">
        {editingTitle ? (
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={commitTitle}
            onKeyDown={(e) => e.key === 'Enter' && commitTitle()}
            className="block-title-input"
            autoFocus
          />
        ) : (
          <div
            onDoubleClick={() => setEditingTitle(true)}
            className="block-title"
          >
            {title}
          </div>
        )}
        <button onClick={() => onDelete(block.id)} className="block-delete">
          ✕
        </button>
      </div>

      {/* EXTRA MINI */}
      {!showExtrasOnly && (
        <div className="extras-mini" onClick={() => setShowExtrasOnly(true)}>
          {[extra1, extra2, extra3].map((v, i) => (
            <span key={i}>{v}</span>
          ))}
        </div>
      )}

      {/* CONTENUTO CENTRALE */}
      <div className="counter-section">
        <AnimatePresence mode="wait">
          {!showExtrasOnly ? (
            <motion.div
              key="main"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              className="flex"
            >
              <div className="counter">
                <button
                  onPointerDown={() => startHold('left', -1)}
                  onPointerUp={stopHold}
                  onPointerLeave={stopHold}
                  onClick={() => handleClick('left', -1)}
                  className="counter-btn"
                >
                  −
                </button>
                <div className="counter-value">{left}</div>
                <button
                  onPointerDown={() => startHold('left', +1)}
                  onPointerUp={stopHold}
                  onPointerLeave={stopHold}
                  onClick={() => handleClick('left', +1)}
                  className="counter-btn"
                >
                  +
                </button>
              </div>

              <div className="counter">
                <button
                  onPointerDown={() => startHold('right', -1)}
                  onPointerUp={stopHold}
                  onPointerLeave={stopHold}
                  onClick={() => handleClick('right', -1)}
                  className="counter-btn"
                >
                  −
                </button>
                <div className="counter-value">{right}</div>
                <button
                  onPointerDown={() => startHold('right', +1)}
                  onPointerUp={stopHold}
                  onPointerLeave={stopHold}
                  onClick={() => handleClick('right', +1)}
                  className="counter-btn"
                >
                  +
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="extra"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="extras-expanded"
            >
              {[1, 2, 3].map((i) => (
                <div key={i} className="extra-box">
                  <div className="value">{block[`extra${i}`] ?? 0}</div>
                  <div className="buttons">
                    <button onClick={() => updateExtra(i, -1)}>−</button>
                    <button onClick={() => updateExtra(i, +1)}>+</button>
                  </div>
                </div>
              ))}
              <button
                onClick={() => setShowExtrasOnly(false)}
                className="return-extras"
              >
                Torna
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 4 BOTTONI INFERIORI */}
      {!showExtrasOnly && (
        <div className="image-buttons">
          {buttonsState.map((active, i) => (
            <button key={i} onClick={() => toggleButton(i)}>
              <img
                src={active ? `icons/btn${i + 1}-on.png` : `icons/btn${i + 1}-off.png`}
                alt={`btn${i + 1}`}
              />
            </button>
          ))}
        </div>
      )}
    </motion.div>
  )
}
