import React, { useState } from 'react'

// Bolt SDK for cloud IDE integration
const COMPONENTS = [
  { id: 'button', name: 'Button', props: { text: 'Click Me', variant: 'primary' } },
  { id: 'input', name: 'Input', props: { placeholder: 'Enter text...' } },
  { id: 'card', name: 'Card', props: { title: 'Card Title' } },
  { id: 'text', name: 'Text', props: { text: 'Hello World' } },
  { id: 'container', name: 'Container', props: {} },
]

// Bolt project config
const boltConfig = {
  v: 3,
  title: 'My App',
  description: 'Built with App Builder',
  template: 'create-react-app',
  settings: {
    compile: { trigger: 'auto', clearConsole: true }
  },
  files: {
    'src/App.jsx': {
      content: `export default function App() {
  return <h1>Hello from Bolt!</h1>
}`
    }
  }
}

export default function App() {
  const [canvas, setCanvas] = useState([])
  const [selected, setSelected] = useState(null)
  const [deploying, setDeploying] = useState(false)

  const addComponent = (comp) => {
    setCanvas([...canvas, { ...comp, instanceId: Date.now() }])
  }

  const deleteComponent = (id) => {
    setCanvas(canvas.filter(c => c.instanceId !== id))
    setSelected(null)
  }

  const deployToBolt = async () => {
    setDeploying(true)
    try {
      const { projects } = await import('@stackblitz/sdk')
      const project = {
        v: 3,
        title: 'App Builder Project',
        template: 'create-react-app',
        files: {
          'src/App.jsx': generateApp(),
          'src/index.css': generateCSS()
        }
      }
      const vm = await projects.openProject(project)
      console.log('Opened in Bolt:', vm)
      alert('Opened in Bolt cloud IDE!')
    } catch (err) {
      alert('Deploy failed: ' + err.message)
    }
    setDeploying(false)
  }

  const generateApp = () => {
    return `import React from 'react'
import './index.css'

${canvas.map((c, i) => {
  if (c.id === 'button') return `function Button${i}() { return <button>${c.props.text}</button> }`
  if (c.id === 'input') return `function Input${i}() { return <input placeholder="${c.props.placeholder}" /> }`
  if (c.id === 'card') return `function Card${i}() { return <div className="card"><h4>${c.props.title}</h4></div> }`
  if (c.id === 'text') return `function Text${i}() { return <p>${c.props.text}</p> }`
  return ''
}).join('\n')}

export default function App() {
  return (
    <div className="app">
      ${canvas.map((c, i) => {
        if (c.id === 'container') return '<div className="container">'
        if (c.id === 'button') return `<Button${i} />`
        if (c.id === 'input') return `<Input${i} />`
        if (c.id === 'card') return `<Card${i} />`
        if (c.id === 'text') return `<Text${i} />`
        return ''
      }).join('\n      ')}
      ${canvas.some(c => c.id === 'container') ? canvas.map(c => c.id === 'container' ? '</div>' : '').join('') : ''}
    </div>
  )
}`
  }

  const generateCSS = () => `* { margin: 0; padding: 0; box-sizing: border-box; }
body { font-family: system-ui, sans-serif; padding: 2rem; }
.app { max-width: 800px; margin: 0 auto; }
button { padding: 0.75rem 1.5rem; background: #8b5cf6; color: white; border: none; border-radius: 6px; cursor: pointer; }
input { padding: 0.75rem; border: 1px solid #ddd; border-radius: 6px; width: 100%; }
.card { background: white; padding: 1rem; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
.container { min-height: 200px; border: 2px dashed #ddd; border-radius: 8px; padding: 1rem; }`

  return (
    <div className="app-builder">
      <header className="header">
        <h1>⚡ App Builder</h1>
        <div className="actions">
          <button onClick={() => setCanvas([])}>Clear</button>
          <button className="primary" onClick={deployToBolt} disabled={deploying}>
            {deploying ? 'Deploying...' : 'Deploy to Bolt'}
          </button>
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
            <div className="empty">Click components to add</div>
          ) : (
            canvas.map(comp => (
              <div key={comp.instanceId} className={`canvas-item ${selected === comp.instanceId ? 'selected' : ''}`}
                onClick={(e) => { e.stopPropagation(); setSelected(comp.instanceId) }}>
                {comp.id === 'button' && <button>{comp.props.text}</button>}
                {comp.id === 'input' && <input placeholder={comp.props.placeholder} />}
                {comp.id === 'card' && <div className="card"><h4>{comp.props.title}</h4></div>}
                {comp.id === 'text' && <p>{comp.props.text}</p>}
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
