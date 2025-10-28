import React, { useState } from 'react'
import useLocalStorage from './hooks/useLocalStorage'
import TabBar from './components/TabBar'
import Block from './components/Block'
import AddBlockButton from './components/AddBlockButton'

const initialTabs = [
  { id: 'tab-1', name: 'Tab 1', blocks: [] },
  { id: 'tab-2', name: 'Tab 2', blocks: [] }
]

function uid() {
  return Math.random().toString(36).slice(2, 9)
}

export default function App() {
  const [tabs, setTabs] = useLocalStorage('scorekeeper:tabs', initialTabs)
  const [active, setActive] = useLocalStorage('scorekeeper:active', 0)

  const addBlock = () => {
    const newBlock = { id: uid(), title: 'Giocatore', left: 0, right: 0 }
    const newTabs = tabs.map((t, i) => i === active ? { ...t, blocks: [...t.blocks, newBlock] } : t)
    setTabs(newTabs)
  }

  const updateBlock = (block) => {
    const newTabs = tabs.map((t, i) => {
      if (i !== active) return t
      return { ...t, blocks: t.blocks.map(b => b.id === block.id ? block : b) }
    })
    setTabs(newTabs)
  }

  const deleteBlock = (id) => {
    const newTabs = tabs.map((t, i) => i === active ? { ...t, blocks: t.blocks.filter(b => b.id !== id) } : t)
    setTabs(newTabs)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50 to-white p-4">
      <div className="max-w-xl mx-auto">
        <h1 className="text-2xl font-bold mb-3">Scorekeeper</h1>

        <TabBar tabs={tabs.map(t => t.name)} active={active} setActive={setActive} />

        <div className="mt-4 space-y-3">
          {tabs[active] && tabs[active].blocks.length === 0 && (
            <div className="text-center text-gray-500">Aggiungi un blocco per iniziare</div>
          )}

          {tabs[active] && tabs[active].blocks.map(b => (
            <Block key={b.id} block={b} onUpdate={updateBlock} onDelete={deleteBlock} />
          ))}

          <AddBlockButton onAdd={addBlock} />
        </div>
      </div>
    </div>
  )
}
