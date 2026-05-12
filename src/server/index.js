import express from 'express'
import { createServer } from 'http'
import { Server } from 'socket.io'
import cors from 'cors'

const app = express()
app.use(cors())
app.use(express.json())

const httpServer = createServer(app)
const io = new Server(httpServer, { cors: { origin: '*' } })

let projects = {}

app.get('/health', (req, res) => res.json({ status: 'ok', service: 'app-builder-api' }))

app.get('/api/projects', (req, res) => res.json(Object.values(projects)))

app.post('/api/projects', (req, res) => {
  const { name, files, template } = req.body
  const id = Date.now().toString(36)
  projects[id] = { id, name, template, files: files || {}, created: new Date().toISOString() }
  io.emit('project-created', projects[id])
  res.json(projects[id])
}))

app.get('/api/projects/:id', (req, res) => {
  const project = projects[req.params.id]
  if (!project) return res.status(404).json({ error: 'Not found' })
  res.json(project)
})

app.put('/api/projects/:id', (req, res) => {
  const { name, files } = req.body
  if (!projects[req.params.id]) return res.status(404).json({ error: 'Not found' })
  projects[req.params.id] = { ...projects[req.params.id], name, files }
  io.emit('project-updated', projects[req.params.id])
  res.json(projects[req.params.id])
})

app.delete('/api/projects/:id', (req, res) => {
  if (!projects[req.params.id]) return res.status(404).json({ error: 'Not found' })
  delete projects[req.params.id]
  io.emit('project-deleted', req.params.id)
  res.json({ deleted: true })
})

const PORT = process.env.PORT || 3001
httpServer.listen(PORT, () => {
  console.log(`App Builder API: http://localhost:${PORT}`)
})
