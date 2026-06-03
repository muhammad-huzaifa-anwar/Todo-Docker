import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import todoRoutes from './routes/todoRoutes.js'
import geminiRoutes from './routes/geminiRoutes.js'
import { notFound, errorHandler } from './middleware/errorHandler.js'

const app = express()

app.use(cors())
app.use(express.json())
app.use(morgan('dev'))

app.get('/health', (req, res) => {
  res.json({ status: 'ok' })
})

app.use('/api/todos', todoRoutes)
app.use('/api/gemini', geminiRoutes)

app.use(notFound)
app.use(errorHandler)

export default app
