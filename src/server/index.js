import express from 'express'
import { createServer } from 'http'
import { Server } from 'socket.io'
import cors from 'cors'
import fs from 'fs'

const app = express()
app.use(cors())
app.use(express.json())

const httpServer = createServer(app)
const io = new Server(httpServer, {
  cors: { origin: '*' }
})

// In-memory storage
let projects = {}
let users = {}

// Health
app.get('/health', (req, res) => res.json({ status: 'ok' }))

// Projects API
app.get('/api/projects', (req, res) => {
  res.json(Object.keys(projects).map(id => ({ id, ...projects[id] })))
})

app.post('/api/projects', (req, res) => {
  const { name, components } = req.body
  const id = Date.now().toString(36)
  projects[id] = { name, components: components || [], created: new Date().toISOString() }
  io.emit('project-created', { id, ...projects[id] })
  res.json({ id, ...projects[id] })
})

app.get('/api/projects/:id', (req, res) => {
  const project = projects[req.params.id]
  if (!project) return res.status(404).json({ error: 'Not found' })
  res.json({ id: req.params.id, ...project })
})

app.put('/api/projects/:id', (req, res) => {
  const { components } = req.body
  if (!projects[req.params.id]) return res.status(404).json({ error: 'Not found' })
  projects[req.params.id].components = components
  io.emit('project-updated', { id: req.params.id, components })
  res.json({ id: req.params.id, ...projects[req.params.id] })
})

app.delete('/api/projects/:id', (req, res) => {
  if (!projects[req.params.id]) return res.status(404).json({ error: 'Not found' })
  delete projects[req.params.id]
  io.emit('project-deleted', req.params.id)
  res.json({ deleted: true })
})

// Export project as zip (mock)
app.get('/api/projects/:id/export', (req, res) => {
  const project = projects[req.params.id]
  if (!project) return res.status(404).json({ error: 'Not found' })
  res.json({ 
    export: JSON.stringify(project.components, null, 2),
    framework: 'react',
    format: 'json'
  })
})

const PORT = process.env.PORT || 3001
httpServer.listen(PORT, () => {
  console.log(`App Builder API running on port ${PORT}`)
})

export default app
