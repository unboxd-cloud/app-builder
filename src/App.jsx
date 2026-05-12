import React, { useState } from 'react'

const TEMPLATES = [
  { id: 'react', name: 'React', description: 'Create React App', emoji: '⚛️', files: { 'App.jsx': 'export default function App() { return <h1>Hello</h1> }' }},
  { id: 'vue', name: 'Vue', description: 'Vue 3 App', emoji: '💚', files: { 'App.vue': '<template><h1>Hello</h1></template>' }},
  { id: 'node', name: 'Node.js', description: 'Express Server', emoji: '🟢', files: { 'server.js': 'const express = require("express")\nconst app = express()\napp.get("/", (req, res) => res.send("Hello"))\napp.listen(3000)' }},
]

export default function App() {
  const [projects, setProjects] = useState([])
  const [selected, setSelected] = useState(null)
  const [editorContent, setEditorContent] = useState('')

  const createProject = (template) => {
    const newProject = {
      id: Date.now().toString(36),
      name: `Project ${projects.length + 1}`,
      template,
      files: template.files,
      created: new Date().toISOString()
    }
    setProjects([...projects, newProject])
  }

  const deleteProject = (id) => {
    setProjects(projects.filter(p => p.id !== id))
  }

  return (
    <div className="app-builder">
      <header className="header">
        <h1>⚡ App Builder <span className="badge">Self-Hosted</span></h1>
        <div className="status">Running on your infrastructure</div>
      </header>

      <div className="main">
        <aside className="sidebar">
          <h3>Templates</h3>
          {TEMPLATES.map(t => (
            <button key={t.id} className="template-btn" onClick={() => createProject(t)}>
              {t.emoji} {t.name}
            </button>
          ))}
          
          <h3>Your Projects</h3>
          {projects.length === 0 ? (
            <p className="empty">No projects yet</p>
          ) : (
            projects.map(p => (
              <div key={p.id} className="project-item" onClick={() => setSelected(p)}>
                <span>{p.template.emoji}</span>
                <span>{p.name}</span>
                <button className="delete" onClick={(e) => { e.stopPropagation(); deleteProject(p.id) }}>×</button>
              </div>
            ))
          )}
        </aside>

        <main className="editor">
          {selected ? (
            <div>
              <div className="editor-header">
                <h2>{selected.name}</h2>
                <button className="run">▶ Run Locally</button>
              </div>
              <textarea 
                value={JSON.stringify(selected.files, null, 2)}
                onChange={(e) => setEditorContent(e.target.value)}
                className="code-editor"
              />
            </div>
          ) : (
            <div className="empty-state">
              <h2>Select a template to get started</h2>
              <p>Your projects run on your servers, not ours.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
