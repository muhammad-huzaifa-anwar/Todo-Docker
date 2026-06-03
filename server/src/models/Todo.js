import mongoose from 'mongoose'

const todoSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '', trim: true },
    completed: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
  },
  { versionKey: false }
)

export const Todo = mongoose.model('Todo', todoSchema)
// Export the Todo model

