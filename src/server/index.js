import express from 'express'
import { createServer } from 'http'
import { Server } from 'socket.io'
import cors from 'cors'

const app = express()
app.use(cors())
app.use(express.json({ extended: true }))

const httpServer = createServer(app)
const io = new Server(httpServer, { cors: { origin: '*' } })

// Project storage
let projects = {}

// Health check
app.get('/health', (req, res) => res.json({ status: 'ok', infra: 'self-hosted' }))

// Projects API
app.get('/api/projects', (req, res) => {
  res.json(Object.values(projects))
})

app.post('/api/projects', (req, res) => {
  const { name, template, files } = req.body
  const id = Date.now().toString(36)
  projects[id] = { id, name, template, files: files || {}, created: new Date().toISOString() }
  io.emit('project-created', projects[id])
  res.json(projects[id])
})

app.get('/api/projects/:id', (req, res) => {
  const project = projects[req.params.id]
  if (!project) return res.status(404).json({ error: 'Not found' })
  res.json(project)
})

app.put('/api/projects/:id', (req, res) => {
  const { files } = req.body
  if (!projects[req.params.id]) return res.status(404).json({ error: 'Not found' })
  projects[req.params.id].files = files
  io.emit('project-updated', projects[req.params.id])
  res.json(projects[req.params.id])
})

app.delete('/api/projects/:id', (req, res) => {
  if (!projects[req.params.id]) return res.status(404).json({ error: 'Not found' })
  delete projects[req.params.id]
  io.emit('project-deleted', req.params.id)
  res.json({ deleted: true })
})

// Get available templates
app.get('/api/templates', (req, res) => {
  res.json([
    { id: 'react', name: 'React', description: 'Create React App', emoji: '⚛️' },
    { id: 'vue', name: 'Vue', description: 'Vue 3 App', emoji: '💚' },
    { id: 'node', name: 'Node.js', description: 'Express Server', emoji: '🟢' },
    { id: 'vanilla', name: 'Vanilla', description: 'Plain JS App', emoji: '📝' },
  ])
})

const PORT = process.env.PORT || 3001
httpServer.listen(PORT, () => {
  console.log(`App Builder API running on port ${PORT}`)
  console.log(`Self-hosted, running on YOUR infrastructure`)
})
