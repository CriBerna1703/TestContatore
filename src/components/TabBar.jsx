import React from 'react'

export default function TabBar({ tabs, active, setActive }) {
  return (
    <div className="flex gap-2 p-2 bg-white/80 backdrop-blur sticky top-0 z-10">
      {tabs.map((t, i) => (
        <button
          key={t}
          onClick={() => setActive(i)}
          className={`flex-1 py-2 rounded-lg font-medium
            ${active===i ? 'bg-teal-500 text-white' : 'bg-gray-100 text-gray-700'}`}
        >
          {t}
        </button>
      ))}
    </div>
  )
}
