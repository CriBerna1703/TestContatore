import React from 'react'
import { motion } from 'framer-motion'

export default function OrderBar({ blocks }) {
  // Calcolo del valore di ordinamento e priorità tab
  const sorted = [...blocks].sort((a, b) => {
    const aVal = (a.extra1 ?? 0) + (a.buttonsState?.[3] ? -1 : 0)
    const bVal = (b.extra1 ?? 0) + (b.buttonsState?.[3] ? -1 : 0)

    // Prima ordina per valore "velocità" (decrescente)
    if (bVal !== aVal) return bVal - aVal

    // In caso di parità → Arena 1 prima di Arena 2
    // Supponendo i nomi "Arena 1" e "Arena 2"
    if (a.tabName === 'Arena 1' && b.tabName === 'Arena 2') return -1
    if (a.tabName === 'Arena 2' && b.tabName === 'Arena 1') return 1

    // Altrimenti mantieni l'ordine originale
    return 0
  })

  return (
    <motion.div
      layout
      className="flex items-center justify-center gap-2 bg-gray-200/80 dark:bg-neutral-700/80 rounded-xl p-2 shadow-inner overflow-x-auto"
      transition={{ layout: { duration: 0.3 } }}
    >
      {sorted.map((b, idx) => (
        <React.Fragment key={b.id}>
          <motion.div
            layout
            className="px-3 py-1 bg-white dark:bg-neutral-800 rounded-lg shadow text-sm font-semibold text-gray-800 dark:text-gray-100 whitespace-nowrap"
            whileHover={{ scale: 1.05 }}
          >
            {b.title}
          </motion.div>
          {idx < sorted.length - 1 && (
            <span className="text-gray-500 dark:text-gray-400">→</span>
          )}
        </React.Fragment>
      ))}
    </motion.div>
  )
}
