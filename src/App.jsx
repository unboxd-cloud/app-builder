import React, { useState, useEffect, useRef } from 'react'
import sdk from '@stackblitz/sdk'
import './index.css'

const API = '' // Connect to your own API

export default function App() {
  const [projects, setProjects] = useState([])
  const [selected, setSelected] = useState(null)
  const [loading, setLoading] = useState(false)
  const embedRef = useRef(null)

  useEffect(() => { loadProjects() }, [])

  useEffect(() => {
    if (selected && embedRef.current) {
      const project = projects.find(p => p.id === selected)
      if (project?.files) {
        sdk.embedProject({
          files: project.files,
          title: project.name,
          template: project.template || 'vanilla'
        }, embedRef.current, { height: 500, theme: 'dark', view: 'preview' })
      }
    }
  }, [selected, projects])

  const loadProjects = async () => {
    try {
      const res = await fetch(`${API}/api/projects`)
      const data = await res.json()
      setProjects(data)
    } catch (e) { console.error(e) }
  }

  const createProject = async (name, template = 'vanilla') => {
    try {
      const res = await fetch(`${API}/api/projects`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, template, files: FILES[template] })
      })
      const project = await res.json()
      setProjects([...projects, project])
      setSelected(project.id)
    } catch (e) { alert('Error: ' + e.message) }
  }

  const deleteProject = async (id) => {
    try {
      await fetch(`${API}/api/projects/${id}`, { method: 'DELETE' })
      setProjects(projects.filter(p => p.id !== id))
      if (selected === id) setSelected(null)
    } catch (e) { alert('Error: ' + e.message) }
  }

  const openInEditor = async () => {
    const project = projects.find(p => p.id === selected)
    if (project) {
      setLoading(true)
      sdk.openProject({
        files: project.files,
        title: project.name,
        template: project.template || 'vanilla'
      }, { openFile: 'index.html', theme: 'dark' })
      setLoading(false)
    }
  }

  return (
    <div className="app-builder">
      <header className="header">
        <h1>⚡ App Builder</h1>
        <button onClick={openInEditor} disabled={!selected || loading}>
          {loading ? 'Opening...' : 'Open in Editor'}
        </button>
      </header>
      
      <div className="main">
        <aside className="sidebar">
          <h3>Projects</h3>
          <button className="new-btn" onClick={() => createProject(`Project ${Date.now()}`)}>
            + New Project
          </button>
          <div className="project-list">
            {projects.map(p => (
              <div key={p.id} className={`project-item ${selected === p.id ? 'selected' : ''}`}
                onClick={() => setSelected(p.id)}>
                <span>{p.name}</span>
                <button onClick={(e) => { e.stopPropagation(); deleteProject(p.id) }}>×</button>
              </div>
            ))}
          </div>
        </aside>

        <main className="content">
          {selected ? (
            <div ref={embedRef} className="embed-container" />
          ) : (
            <div className="empty">
              <h2>Select or create a project</h2>
              <p>Projects are stored on YOUR API server</p>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

const FILES = {
  vanilla: {
    'index.html': '<h1>Hello</h1><button>Click</button>',
    'style.css': 'body { font-family: sans-serif; padding: 2rem; }',
    'main.js': 'console.log("ok")'
  },
  react: {
    'src/App.jsx': 'export default () => <h1>Hello</h1>',
    'src/main.jsx': 'import React from "react"',
    'package.json': '{"dependencies": {"react": "^18"}}'
  }
}
