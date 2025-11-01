import React from 'react'
import useLocalStorage from './hooks/useLocalStorage'
import TabBar from './components/TabBar'
import Block from './components/Block'
import AddBlockButton from './components/AddBlockButton'
import OrderBar from './components/OrderBar' // 👈 aggiungi qui
import RoomManager from './components/RoomManager'
import { rooms } from './rooms'
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'

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
    const newBlock = { id: uid(), title: 'Giocatore', left: 0, right: 0, extra1: 0, extra2: 0, extra3: 0 }
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
            // callback form → updater riceve il blocco e restituisce un nuovo blocco
            const updated = updater(b)
            return b.id === updated.id ? updated : b
          }
          // object form → updater è un oggetto completo del blocco
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

  const onDragEnd = (result) => {
    if (!result.destination) return
    const sourceIndex = result.source.index
    const destIndex = result.destination.index
    const tab = tabs[active]
    const newBlocks = Array.from(tab.blocks)
    const [moved] = newBlocks.splice(sourceIndex, 1)
    newBlocks.splice(destIndex, 0, moved)
    const newTabs = tabs.map((t, i) =>
      i === active ? { ...t, blocks: newBlocks } : t
    )
    setTabs(newTabs)
  }

  return (
    <div className="min-h-screen bg-neutral-100 dark:bg-neutral-900 p-4">
      <div className="max-w-xl mx-auto">
        <header className="flex items-center justify-between gap-3 mb-4">
          <h1 className="font-fantasy text-2xl text-gray-900 dark:text-gray-100 drop-shadow">
            Scorekeeper
          </h1>
        </header>

        <TabBar tabs={tabs.map((t) => t.name)} active={active} setActive={setActive} />

        {/* 🧭 Barra dell’ordine */}
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
        <div className="mt-4 space-y-3">
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="blocks">
              {(provided) => (
                <div ref={provided.innerRef} {...provided.droppableProps} className="space-y-3">
                  {tabs[active] &&
                    tabs[active].blocks.map((b, idx) => (
                      <Draggable key={b.id} draggableId={b.id} index={idx}>
                        {(draggableProvided) => (
                          <div
                            ref={draggableProvided.innerRef}
                            {...draggableProvided.draggableProps}
                            style={draggableProvided.draggableProps.style}
                          >
                            <Block
                              block={b}
                              onUpdate={updateBlock}
                              onDelete={deleteBlock}
                              dragHandleProps={draggableProvided.dragHandleProps}
                            />
                          </div>
                        )}
                      </Draggable>
                    ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>

          <AddBlockButton onAdd={addBlock} />
        </div>
      </div>
    </div>
  )
}
