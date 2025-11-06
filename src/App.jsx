import React from 'react'
import useLocalStorage from './hooks/useLocalStorage'
import TabBar from './components/TabBar'
import Block from './components/Block'
import OrderBar from './components/OrderBar'
import RoomManager from './components/RoomManager'
import { rooms } from './rooms'
import './App.css'

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

  const addBlockInSlot = (slotIndex) => {
    const newBlock = {
      id: uid(),
      title: `Giocatore ${slotIndex + 1}`,
      left: 0,
      right: 0,
      extra1: 0,
      extra2: 0,
      extra3: 0,
      buttonsState: [false, false, false, false],
      slot: slotIndex
    }
    const newTabs = tabs.map((t, i) =>
      i === active ? { ...t, blocks: [...t.blocks, newBlock] } : t
    )
    setTabs(newTabs)
  }

  const updateBlock = (updater) => {
    setTabs((prevTabs) => {
      return prevTabs.map((t, i) => {
        if (i !== active) return t

        const updatedBlocks = t.blocks.map((b) => {
          if (typeof updater === 'function') {
            const updated = updater(b)
            return b.id === updated.id ? updated : b
          }
          return b.id === updater.id ? updater : b
        })

        return { ...t, blocks: updatedBlocks }
      })
    })
  }

  const deleteBlock = (id) => {
    const newTabs = tabs.map((t, i) =>
      i === active ? { ...t, blocks: t.blocks.filter((b) => b.id !== id) } : t
    )
    setTabs(newTabs)
  }

  const orderedBlocks = [...(tabs[active]?.blocks || [])].sort(
    (a, b) => (a.slot ?? 0) - (b.slot ?? 0)
  )

  return (
    <div id="root-app">
      <header className="app-header">
        <h1 className="app-title">Scorekeeper</h1>
      </header>

      <TabBar tabs={tabs.map((t) => t.name)} active={active} setActive={setActive} />

      <OrderBar
        blocks={tabs.flatMap((t) =>
          t.blocks.map((b) => ({ ...b, tabName: t.name }))
        )}
      />

      {active === 1 && (
        <RoomManager
          rooms={rooms}
          onLoadRoom={(room) => {
            const newTabs = tabs.map((t, i) =>
              i === 1 ? { ...t, blocks: room.blocks.map(b => ({ ...b })) } : t
            )
            setTabs(newTabs)
          }}
        />
      )}

      <div className="blocks-grid">
        {Array.from({ length: 4 }).map((_, i) => {
          const block = orderedBlocks.find(b => b.slot === i)
          return (
            <div key={i} className="block-slot">
              {block ? (
                <Block
                  block={block}
                  onUpdate={updateBlock}
                  onDelete={deleteBlock}
                />
              ) : (
                <button
                  onClick={() => addBlockInSlot(i)}
                  className="empty-slot"
                >
                  ＋
                </button>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
