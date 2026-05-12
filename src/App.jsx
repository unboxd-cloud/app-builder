import React, { useState } from 'react'

const COMPONENTS = [
  { id: 'button', name: 'Button', props: { text: 'Click Me', variant: 'primary' } },
  { id: 'input', name: 'Input', props: { placeholder: 'Enter text...' } },
  { id: 'card', name: 'Card', props: { title: 'Card Title' } },
  { id: 'text', name: 'Text', props: { text: 'Hello World' } },
  { id: 'image', name: 'Image', props: { src: 'https://picsum.photos/300/200' } },
  { id: 'container', name: 'Container', props: {} },
]

export default function App() {
  const [canvas, setCanvas] = useState([])
  const [selected, setSelected] = useState(null)

  const addComponent = (comp) => {
    const newComp = { ...comp, instanceId: Date.now() }
    setCanvas([...canvas, newComp])
  }

  const deleteComponent = (id) => {
    setCanvas(canvas.filter(c => c.instanceId !== id))
    setSelected(null)
  }

  return (
    <div className="app-builder">
      <header className="header">
        <h1>⚡ App Builder</h1>
        <div className="actions">
          <button onClick={() => setCanvas([])}>Clear</button>
          <button className="primary" onClick={() => alert('Export: ' + JSON.stringify(canvas, null, 2))}>Export</button>
        </div>
      </header>
      
      <div className="workspace">
        <aside className="sidebar">
          <h3>Components</h3>
          <div className="component-list">
            {COMPONENTS.map(comp => (
              <div key={comp.id} className="component-item" onClick={() => addComponent(comp)}>
                {comp.name}
              </div>
            ))}
          </div>
        </aside>
        
        <main className="canvas" onClick={() => setSelected(null)}>
          {canvas.length === 0 ? (
            <div className="empty">Drag components here or click to add</div>
          ) : (
            canvas.map((comp, i) => (
              <div key={comp.instanceId} className={`canvas-item ${selected === comp.instanceId ? 'selected' : ''}`}
                onClick={(e) => { e.stopPropagation(); setSelected(comp.instanceId) }}>
                {comp.id === 'button' && <button className="preview">{comp.props.text}</button>}
                {comp.id === 'input' && <input placeholder={comp.props.placeholder} />}
                {comp.id === 'card' && <div className="card"><h4>{comp.props.title}</h4><p>Card content</p></div>}
                {comp.id === 'text' && <p>{comp.props.text}</p>}
                {comp.id === 'image' && <img src={comp.props.src} alt="" />}
                {comp.id === 'container' && <div className="container">Container</div>}
              </div>
            ))
          )}
        </main>
        
        {selected && (
          <aside className="properties">
            <h3>Properties</h3>
            <button className="delete" onClick={() => deleteComponent(selected)}>Delete</button>
          </aside>
        )}
      </div>
    </div>
  )
}
