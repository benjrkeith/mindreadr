import express, { json } from 'express'
import logger from 'morgan'
import { createServer } from 'node:http'
import { Server } from 'socket.io'

import authRouter from './routes/auth.js'
import inboxRouter from './routes/inbox.js'
import postsRouter from './routes/posts.js'
import usersRouter from './routes/users.js'

import checkJSON from './middleware/checkJSON.js'

const app = express()
const server = createServer(app)
const ws = new Server(server, {
  cors: {
    origin: ['http://192.168.0.129:5173', 'http://localhost:5173']
  }
})

ws.on('connection', (socket) => {
  console.log('connected')
  socket.on('join', async (room) => {
    console.log('joining', room)
    await socket.join(room as string)
  })
  socket.on('leave', async (room) => {
    console.log('leave', room)
    await socket.leave(room as string)
  })
})

app.use(logger('dev'))
app.use(json())
app.use(checkJSON)

app.use('/api/auth', authRouter)
app.use('/api/inbox', inboxRouter)
app.use('/api/posts', postsRouter)
app.use('/api/users', usersRouter)

app.set('ws', ws)

server.listen(4000, () => {
  console.log('Server is running at http://localhost:4000')
})
