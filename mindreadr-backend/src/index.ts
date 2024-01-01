import express, { json } from 'express'
import logger from 'morgan'

import authRouter from './routes/auth.js'
import postsRouter from './routes/posts.js'

const app = express()

app.use(json())
app.use(logger('dev'))

app.get('/', (req, res) => {res.send('hello there!')})
app.use('/api/auth', authRouter)
app.use('/api/posts', postsRouter)

app.listen(4000, () => {
    console.log('Server is running at http://localhost:4000')
})