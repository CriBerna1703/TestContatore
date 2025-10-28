import React from 'react'

export default function TabBar({ tabs, active, setActive }) {
  return (
    <div className="flex gap-2 p-2 bg-white/10 rounded-md backdrop-blur-sm">
      {tabs.map((t, i) => (
        <button
          key={t}
          onClick={() => setActive(i)}
          className={`flex-1 py-2 rounded-lg font-medium text-sm
            ${active===i ? 'bg-gradient-to-br from-dnd-brown/60 to-dnd-velvet text-dnd-gold' : 'bg-gray-100/40 dark:bg-white/5 text-gray-700 dark:text-gray-300'}`}
        >
          {t}
        </button>
      ))}
    </div>
  )
}
