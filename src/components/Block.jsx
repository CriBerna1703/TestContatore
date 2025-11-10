import React, { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

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

  const startHold = (key, delta) => {
    holdStarted.current = false
    holdTimeout.current = setTimeout(() => {
      holdStarted.current = true
      holdInterval.current = setInterval(() => {
        onUpdate(prev => {
          if (prev.id !== block.id) return prev
          return { ...prev, [key]: (prev[key] ?? 0) + delta * 5 }
        })
      }, 500)
    }, 500)
  }

  const stopHold = () => {
    clearTimeout(holdTimeout.current)
    clearInterval(holdInterval.current)
  }

  const handleClick = (key, delta) => {
    if (holdStarted.current) {
      holdStarted.current = false
      return
    }
    update({ [key]: (block[key] ?? 0) + delta })
  }

  const toggleButton = (i) => {
    const newState = [...buttonsState]
    newState[i] = !newState[i]
    setButtonsState(newState)
    update({ buttonsState: newState })
  }

  const commitTitle = () => {
    setEditingTitle(false)
    update({ title: title || 'Giocatore' })
  }

  // Nomi dei contatori centrali
  const mainCounterNames = ['Contatore 1', 'Contatore 2']
  // Nomi degli extra
  const extraNames = ['Extra 1', 'Extra 2', 'Extra 3']

  return (
    <motion.div
      layout
      className="block-container"
      onClick={(e) => {
        if (showExtrasOnly && e.target.tagName !== 'BUTTON') {
          setShowExtrasOnly(false)
        }
      }}
    >
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

      {/* MINI EXTRAS */}
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
              className="main-counters"
            >
              {['left', 'right'].map((key, i) => (
                <div key={key} className="counter-box">
                  <div className="smart-counter">
                    <div
                      className="counter-half left-half"
                      onPointerDown={() => startHold(key, -1)}
                      onPointerUp={stopHold}
                      onPointerLeave={stopHold}
                      onClick={(e) => { e.stopPropagation(); handleClick(key, -1) }}
                    >
                      <span>−</span>
                    </div>
                    <div className="counter-value">{block[key]}</div>
                    <div
                      className="counter-half right-half"
                      onPointerDown={() => startHold(key, +1)}
                      onPointerUp={stopHold}
                      onPointerLeave={stopHold}
                      onClick={(e) => { e.stopPropagation(); handleClick(key, +1) }}
                    >
                      <span>＋</span>
                    </div>
                  </div>
                  <div className="counter-label">{mainCounterNames[i]}</div>
                </div>
              ))}
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
              {[1, 2, 3].map((i) => {
                const key = `extra${i}`
                return (
                  <div key={key} className="counter-box">
                    <div className="smart-counter extra-version">
                      <div
                        className="counter-half left-half"
                        onClick={(e) => { e.stopPropagation(); handleClick(key, -1) }}
                      >
                        <span>−</span>
                      </div>
                      <div className="counter-value">{block[key]}</div>
                      <div
                        className="counter-half right-half"
                      onClick={(e) => { e.stopPropagation(); handleClick(key, +1) }}
                      >
                        <span>＋</span>
                      </div>
                    </div>
                    <div className="counter-label">{extraNames[i-1]}</div>
                  </div>
                )
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* BOTTONI INFERIORI */}
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
