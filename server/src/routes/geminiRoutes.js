import express from 'express'
import { suggestTasks, categorizeTasks, chatWithAI } from '../geminiService.js'

const router = express.Router()

function normalizeTasks(tasks) {
  if (Array.isArray(tasks)) return tasks
  if (typeof tasks === 'string') return tasks.split(/\r?\n/).map((line) => line.trim()).filter(Boolean)
  return []
}

router.post('/suggest', async (req, res) => {
  try {
    const { tasks } = req.body
    const suggestions = await suggestTasks(normalizeTasks(tasks))
    res.json({ suggestions })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.post('/categorize', async (req, res) => {
  try {
    const { tasks } = req.body
    const categorized = await categorizeTasks(normalizeTasks(tasks))
    res.json({ categorized })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.post('/chat', async (req, res) => {
  try {
    const { message, tasks } = req.body
    const reply = await chatWithAI(message || '', Array.isArray(tasks) ? tasks : [])
    res.json({ reply })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

export default router





// import express from 'express'
// import { suggestTasks, categorizeTasks, chatWithAI } from '../geminiService.js'

// const router = express.Router()

// function normalizeTasks(tasks) {
//   if (Array.isArray(tasks)) return tasks
//   if (typeof tasks === 'string') return tasks.split(/\r?\n/).map((line) => line.trim()).filter(Boolean)
//   return []
// }

// router.post('/suggest', async (req, res) => {
//   try {
//     const { tasks } = req.body
//     const suggestions = await suggestTasks(normalizeTasks(tasks))
//     res.json({ suggestions })
//   } catch (err) {
//     res.status(500).json({ error: err.message })
//   }
// })

// router.post('/categorize', async (req, res) => {
//   try {
//     const { tasks } = req.body
//     const categorized = await categorizeTasks(normalizeTasks(tasks))
//     res.json({ categorized })
//   } catch (err) {
//     res.status(500).json({ error: err.message })
//   }
// })

// router.post('/chat', async (req, res) => {
//   try {
//     const { message, tasks } = req.body
//     const reply = await chatWithAI(message || '', Array.isArray(tasks) ? tasks : [])
//     res.json({ reply })
//   } catch (err) {
//     res.status(500).json({ error: err.message })
//   }
// })

// export default router
