import React from 'react'
import useLocalStorage from './hooks/useLocalStorage'
import useTheme from './hooks/useTheme'
import TabBar from './components/TabBar'
import Block from './components/Block'
import AddBlockButton from './components/AddBlockButton'
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'

const initialTabs = [
  { id: 'tab-1', name: 'Tab 1', blocks: [] },
  { id: 'tab-2', name: 'Tab 2', blocks: [] }
]

function uid(){ return Math.random().toString(36).slice(2,9) }

export default function App() {
  const [tabs, setTabs] = useLocalStorage('scorekeeper:tabs', initialTabs)
  const [active, setActive] = useLocalStorage('scorekeeper:active', 0)
  const [theme, setTheme] = useTheme()

  const addBlock = () => {
    const newBlock = { id: uid(), title: 'Giocatore', left: 0, right: 0 }
    const newTabs = tabs.map((t,i) => i===active ? { ...t, blocks: [...t.blocks, newBlock] } : t)
    setTabs(newTabs)
  }

  const updateBlock = (block) => {
    const newTabs = tabs.map((t,i) => {
      if (i!==active) return t
      return { ...t, blocks: t.blocks.map(b => b.id===block.id ? block : b) }
    })
    setTabs(newTabs)
  }

  const deleteBlock = (id) => {
    const newTabs = tabs.map((t,i) => i===active ? { ...t, blocks: t.blocks.filter(b => b.id!==id) } : t)
    setTabs(newTabs)
  }

  const onDragEnd = (result) => {
    if (!result.destination) return
    const sourceIndex = result.source.index
    const destIndex = result.destination.index
    const tab = tabs[active]
    const newBlocks = Array.from(tab.blocks)
    const [moved] = newBlocks.splice(sourceIndex,1)
    newBlocks.splice(destIndex,0,moved)
    const newTabs = tabs.map((t,i) => i===active ? { ...t, blocks: newBlocks } : t)
    setTabs(newTabs)
  }

  // Export JSON (download)
  const exportJSON = () => {
    const data = JSON.stringify(tabs, null, 2)
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'scorekeeper_export.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  // Import JSON
  const importJSON = (file) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const parsed = JSON.parse(e.target.result)
        if (Array.isArray(parsed)) {
          setTabs(parsed)
          alert('Import completato')
        } else {
          alert('File non valido: struttura errata')
        }
      } catch (err) {
        alert('Errore parsing JSON')
      }
    }
    reader.readAsText(file)
  }

  return (
    <div className="min-h-screen bg-[url('/public/texture-bg.png')] bg-cover p-4 dark:bg-dnd-velvet">
      <div className="max-w-xl mx-auto">
        <header className="flex items-center justify-between gap-3 mb-4">
          <h1 className="font-fantasy text-2xl text-dnd-gold">Scorekeeper</h1>
          <div className="flex gap-2 items-center">
            <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="px-3 py-1 rounded border bg-white/5 text-sm">
              {theme === 'dark' ? 'Light' : 'Dark'}
            </button>
            <button onClick={exportJSON} className="px-3 py-1 rounded border text-sm">Export</button>
            <label className="px-3 py-1 rounded border text-sm cursor-pointer">
              Import
              <input type="file" accept="application/json" style={{display:'none'}} onChange={(e) => {
                if (e.target.files?.[0]) importJSON(e.target.files[0])
              }} />
            </label>
          </div>
        </header>

        <TabBar tabs={tabs.map(t => t.name)} active={active} setActive={setActive} />

        <div className="mt-4 space-y-3">
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="blocks">
            {(provided) => (
              <div ref={provided.innerRef} {...provided.droppableProps} className="space-y-3">
                {tabs[active] && tabs[active].blocks.map((b, idx) => (
                  <Draggable key={b.id} draggableId={b.id} index={idx}>
                    {(draggableProvided, snapshot) => (
                      <div ref={draggableProvided.innerRef}
                           {...draggableProvided.draggableProps}
                           style={{ ...draggableProvided.draggableProps.style }}>
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
