import React, { useState } from 'react'
import sdk from '@stackblitz/sdk'

// Embed a StackBlitz project
const EmbedProject = ({ projectId }) => {
  sdk.embedProjectId('embed-container', projectId, { 
    height: 600,
    theme: 'dark'
  })
  return <div id="embed-container" />
}

// Pre-built StackBlitz templates
const TEMPLATES = [
  { id: 'react', name: 'React', description: 'Create React App', emoji: '⚛️' },
  { id: 'vue', name: 'Vue', description: 'Vue 3 App', emoji: '💚' },
  { id: 'angular', name: 'Angular', description: 'Angular App', emoji: '🚀' },
  { id: 'node', name: 'Node.js', description: 'Express Server', emoji: '🟢' },
  { id: 'typescript', name: 'TypeScript', description: 'TypeScript Starter', emoji: '🔷' },
  { id: 'vanilla', name: 'Vanilla', description: 'Plain JS App', emoji: '📝' },
]

const DEMO_PROJECT = {
  files: {
    'index.html': `<!DOCTYPE html>
<html>
<head>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <h1>Hello from App Builder! 🚀</h1>
  <p>Edit this file to see changes live.</p>
  <button onclick="alert('Clicked!')">Click Me</button>
  <script type="module" src="main.js"></script>
</body>
</html>`,
    'style.css': `body {
  font-family: system-ui, sans-serif;
  max-width: 800px;
  margin: 2rem auto;
  padding: 0 1rem;
  background: #1a1a2e;
  color: #eee;
}
button {
  background: #6366f1;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  cursor: pointer;
}
button:hover { background: #818cf8; }`,
    'main.js': `console.log('App initialized!')`
  },
  title: 'My App Builder Project',
  description: 'Built with App Builder',
  template: 'vanilla',
  settings: {
    compile: { trigger: 'auto', clearConsole: true }
  }
}

export default function App() {
  const [mode, setMode] = useState('select') // select | editor | preview

  const openInEditor = () => {
    sdk.openProject(DEMO_PROJECT, { 
      openFile: 'index.html',
      theme: 'dark'
    })
  }

  const embedProject = () => {
    sdk.embedProject(DEMO_PROJECT, 'embed-container', {
      height: 600,
      theme: 'dark',
      view: 'preview'
    })
  }

  return (
    <div className="app-builder">
      <header className="header">
        <h1>⚡ App Builder <span className="badge">Powered by StackBlitz</span></h1>
        <div className="actions">
          <button onClick={openInEditor}>Open in Editor</button>
          <button className="primary" onClick={embedProject}>Preview</button>
        </div>
      </header>

      <div className="content">
        {mode === 'select' && (
          <div className="templates">
            <h2>Choose a Template</h2>
            <div className="template-grid">
              {TEMPLATES.map(t => (
                <div key={t.id} className="template-card" onClick={openInEditor}>
                  <span className="emoji">{t.emoji}</span>
                  <h3>{t.name}</h3>
                  <p>{t.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {mode === 'preview' && (
          <div className="preview-container">
            <div id="embed-container" />
          </div>
        )}
      </div>
    </div>
  )
}
