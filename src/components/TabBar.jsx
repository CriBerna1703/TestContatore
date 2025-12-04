import React from 'react'
import './TabBar.css'

export default function TabBar({ tabs, active, setActive }) {
  return (
    <div className="tabbar-container">
      {tabs.map((t, i) => (
        <div
          key={t}
          className={`tab-item ${active === i ? 'active' : ''}`}
          onClick={() => setActive(i)}
        >
          {t}
        </div>
      ))}
    </div>
  )
}
