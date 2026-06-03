import { Todo } from '../models/Todo.js'

export const createTodo = async (req, res, next) => {
  try {
    const { title, description } = req.body
    if (!title || !title.trim()) {
      return res.status(400).json({ message: 'title is required' })
    }
    const todo = await Todo.create({ title: title.trim(), description: description?.trim() || '' })
    res.status(201).json(todo)
  } catch (err) {
    next(err)
  }
}

export const getTodos = async (req, res, next) => {
  try {
    const todos = await Todo.find().sort({ createdAt: -1 })
    res.json(todos)
  } catch (err) {
    next(err)
  }
}

export const getTodoById = async (req, res, next) => {
  try {
    const todo = await Todo.findById(req.params.id)
    if (!todo) return res.status(404).json({ message: 'Todo not found' })
    res.json(todo)
  } catch (err) {
    next(err)
  }
}

export const updateTodo = async (req, res, next) => {
  try {
    const { title, description, completed } = req.body
    const update = {}
    if (title !== undefined) update.title = String(title).trim()
    if (description !== undefined) update.description = String(description).trim()
    if (completed !== undefined) update.completed = Boolean(completed)

    const todo = await Todo.findByIdAndUpdate(req.params.id, update, { new: true, runValidators: true })
    if (!todo) return res.status(404).json({ message: 'Todo not found' })
    res.json(todo)
  } catch (err) {
    next(err)
  }
}

export const deleteTodo = async (req, res, next) => {
  try {
    const todo = await Todo.findByIdAndDelete(req.params.id)
    if (!todo) return res.status(404).json({ message: 'Todo not found' })
    res.status(204).send()
  } catch (err) {
    next(err)
  }
}
