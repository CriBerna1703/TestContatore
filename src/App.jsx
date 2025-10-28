import React from 'react'
import useLocalStorage from './hooks/useLocalStorage'
import TabBar from './components/TabBar'
import Block from './components/Block'
import AddBlockButton from './components/AddBlockButton'
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'

const initialTabs = [
  { id: 'tab-1', name: 'Arena 1', blocks: [] },
  { id: 'tab-2', name: 'Arena 2', blocks: [] }
]

function uid() {
  return Math.random().toString(36).slice(2, 9)
}

export default function App() {
  const [tabs, setTabs] = useLocalStorage('scorekeeper:tabs', initialTabs)
  const [active, setActive] = useLocalStorage('scorekeeper:active', 0)

  const addBlock = () => {
    const newBlock = { id: uid(), title: 'Giocatore', left: 0, right: 0 }
    const newTabs = tabs.map((t, i) =>
      i === active ? { ...t, blocks: [...t.blocks, newBlock] } : t
    )
    setTabs(newTabs)
  }

  const updateBlock = (block) => {
    const newTabs = tabs.map((t, i) => {
      if (i !== active) return t
      return { ...t, blocks: t.blocks.map((b) => (b.id === block.id ? block : b)) }
    })
    setTabs(newTabs)
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <div className="max-w-xl mx-auto">
        {/* Header */}
        <header className="flex items-center justify-between mb-4">
          <h1 className="font-fantasy text-3xl text-dnd-gold drop-shadow-lg">
            ⚔️ Scorekeeper ⚔️
          </h1>
        </header>

        {/* Tabs */}
        <TabBar tabs={tabs.map((t) => t.name)} active={active} setActive={setActive} />

        {/* Blocks List */}
        <div className="mt-4 space-y-4">
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="blocks">
              {(provided) => (
                <div ref={provided.innerRef} {...provided.droppableProps} className="space-y-4">
                  {tabs[active]?.blocks.map((b, idx) => (
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

          {/* Add Block Button */}
          <div className="flex justify-center mt-6">
            <AddBlockButton onAdd={addBlock} />
          </div>
        </div>
      </div>
    </div>
  )
}
