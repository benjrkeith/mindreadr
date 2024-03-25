import express, { json } from 'express'
import logger from 'morgan'

import checkJSON from './middleware/checkJSON.js'
import authRouter from './routes/auth.js'
import postsRouter from './routes/posts.js'
import usersRouter from './routes/users.js'
import messagesRouter from './routes/messages.js'

const app = express()

app.use(json())
app.use(logger('dev'))
app.use(checkJSON)

app.get('/', (req, res) => { res.send('hello there!') })
app.use('/api/auth', authRouter)
app.use('/api/posts', postsRouter)
app.use('/api/users', usersRouter)
app.use('/api/messages', messagesRouter)

app.listen(4000, () => {
  console.log('Server is running at http://localhost:4000')
})
