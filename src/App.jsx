import React, { useState, useEffect } from 'react'
import sdk from '@stackblitz/sdk'

const DEMO_PROJECT = {
  files: {
    'index.html': `<!DOCTYPE html>
<html>
<head>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <h1>Hello from App Builder! 🚀</h1>
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
}`,
    'main.js': `console.log('App initialized!')`
  },
  title: 'App Builder Demo',
  template: 'vanilla',
  settings: { theme: 'dark' }
}

export default function App() {
  const [embedRef, setEmbedRef] = useState(null)

  useEffect(() => {
    if (embedRef) {
      sdk.embedProject(DEMO_PROJECT, embedRef, {
        height: 600,
        theme: 'dark',
        view: 'preview'
      })
    }
  }, [embedRef])

  const openEditor = () => {
    sdk.openProject(DEMO_PROJECT, {
      openFile: 'index.html',
      theme: 'dark'
    })
  }

  return (
    <div className="app-builder">
      <header className="header">
        <h1>⚡ App Builder</h1>
        <button onClick={openEditor}>Open in Editor</button>
      </header>
      <main>
        <div ref={setEmbedRef} id="embed-container" />
      </main>
    </div>
  )
}
