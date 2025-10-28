import React, { useState, useRef } from 'react'

export default function Block({ block, onUpdate, onDelete, dragHandleProps }) {
  const [editing, setEditing] = useState(false)
  const [title, setTitle] = useState(block.title || '')
  const holdTimer = useRef(null)
  const lastTap = useRef(0)

  const commitTitle = () => {
    setEditing(false)
    onUpdate({ ...block, title: title || 'Giocatore' })
  }

  // Update helper
  const update = (changes) => onUpdate({ ...block, ...changes })

  // Touch/Pointer handling: long press -> +5 on the counter you touched,
  // double tap -> reset both.
  const onPointerDown = (side) => (e) => {
    // double tap
    const now = Date.now()
    if (now - lastTap.current < 300) {
      // double tap detected: reset both
      update({ left: 0, right: 0 })
      lastTap.current = 0
      return
    }
    lastTap.current = now

    // start hold timer
    holdTimer.current = setTimeout(() => {
      if (side === 'left') update({ left: block.left + 5 })
      else update({ right: block.right + 5 })
      holdTimer.current = null
    }, 500) // hold threshold 500ms
  }

  const onPointerUp = () => {
    if (holdTimer.current) {
      clearTimeout(holdTimer.current)
      holdTimer.current = null
    }
  }

  return (
    <div className="p-3 bg-gradient-to-br from-white/80 to-white/60 dark:from-[#1b1216]/80 dark:to-[#2a1b24]/80 rounded-lg shadow-ornate border border-dnd-brown/20">
      <div className="flex justify-between items-center gap-2">
        <div className="flex items-center gap-2">
          <div {...dragHandleProps} className="cursor-grab select-none px-2 py-1 rounded bg-dnd-brown/10 text-sm">≡</div>
          {editing ? (
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={commitTitle}
              onKeyDown={(e) => e.key === 'Enter' && commitTitle()}
              className="text-lg font-semibold bg-transparent border-b border-dnd-gold/30 focus:outline-none"
            />
          ) : (
            <div onDoubleClick={() => setEditing(true)} className="text-lg font-semibold font-fantasy text-dnd-brown dark:text-dnd-gold">
              {block.title || 'Giocatore'}
            </div>
          )}
        </div>

        <div className="flex gap-2">
          <button onClick={() => onDelete(block.id)} className="text-xs px-2 py-1 rounded bg-red-600 text-white">Elimina</button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-3">
        <div className="flex flex-col items-center">
          <div className="text-3xl font-bold">{block.left}</div>
          <div className="flex gap-2 mt-2">
            <button
              onPointerDown={onPointerDown('left')}
              onPointerUp={onPointerUp}
              onPointerCancel={onPointerUp}
              onClick={() => update({ left: block.left - 1 })}
              className="px-3 py-1 rounded bg-gray-200 dark:bg-gray-700 active:scale-95"
            >−</button>

            <button
              onPointerDown={onPointerDown('left')}
              onPointerUp={onPointerUp}
              onPointerCancel={onPointerUp}
              onClick={() => update({ left: block.left + 1 })}
              className="px-3 py-1 rounded bg-gray-200 dark:bg-gray-700 active:scale-95"
            >+</button>
          </div>
        </div>

        <div className="flex flex-col items-center">
          <div className="text-3xl font-bold">{block.right}</div>
          <div className="flex gap-2 mt-2">
            <button
              onPointerDown={onPointerDown('right')}
              onPointerUp={onPointerUp}
              onPointerCancel={onPointerUp}
              onClick={() => update({ right: block.right - 1 })}
              className="px-3 py-1 rounded bg-gray-200 dark:bg-gray-700 active:scale-95"
            >−</button>

            <button
              onPointerDown={onPointerDown('right')}
              onPointerUp={onPointerUp}
              onPointerCancel={onPointerUp}
              onClick={() => update({ right: block.right + 1 })}
              className="px-3 py-1 rounded bg-gray-200 dark:bg-gray-700 active:scale-95"
            >+</button>
          </div>
        </div>
      </div>

      <div className="flex gap-2 mt-3">
        <button onClick={() => update({ left:0, right:0 })} className="flex-1 py-1 rounded border">Reset</button>
        <button onClick={() => update({ left: block.left + 1, right: block.right + 1 })} className="flex-1 py-1 rounded border">+ Entrambi</button>
      </div>

      <div className="mt-2 text-xs text-gray-500">Doppio tap = reset, tieni premuto per +5</div>
    </div>
  )
}
