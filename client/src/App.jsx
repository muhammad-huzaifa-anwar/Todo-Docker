import { useEffect, useState } from 'react'
import { TodosAPI } from './api'
import TodoForm from './components/TodoForm.jsx'
import TodoList from './components/TodoList.jsx'
import './App.css'
import geminiService from './geminiService'

export default function App() {
  const [todos, setTodos] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const fetchTodos = async () => {
    setLoading(true)
    setError('')
    try {
      const data = await TodosAPI.list()
      setTodos(data)
    } catch {
      setError('Failed to load')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTodos()
  }, [])

  const addTodo = async (payload) => {
    setLoading(true)
    setError('')
    try {
      const created = await TodosAPI.create(payload)
      setTodos((prev) => [created, ...prev])
    } catch {
      setError('Failed to add')
    } finally {
      setLoading(false)
    }
  }

  const updateTodo = async (id, payload) => {
    setError('')
    try {
      const updated = await TodosAPI.update(id, payload)
      setTodos((prev) => prev.map((t) => (t._id === id ? updated : t)))
    } catch {
      setError('Failed to update')
    }
  }

  const deleteTodo = async (id) => {
    setError('')
    try {
      await TodosAPI.remove(id)
      setTodos((prev) => prev.filter((t) => t._id !== id))
    } catch {
      setError('Failed to delete')
    }
  }

  // AI states
  const [aiLoading, setAiLoading] = useState(false)
  const [suggestions, setSuggestions] = useState([])
  const [categories, setCategories] = useState(null)
  const [chatInput, setChatInput] = useState('')
  const [chatMessages, setChatMessages] = useState([])

  const handleSuggest = async () => {
    setAiLoading(true)
    try {
      const text = todos.map(t => t.title || t.text || JSON.stringify(t)).join('\n')
      const items = await geminiService.suggestTasks(text)
      setSuggestions(items)
    } catch (err) {
      setError(err.message)
    } finally {
      setAiLoading(false)
    }
  }

  const handleCategorize = async () => {
    setAiLoading(true)
    try {
      const text = todos.map(t => t.title || t.text || JSON.stringify(t)).join('\n')
      const res = await geminiService.categorizeTasks(text)
      setCategories(res)
    } catch (err) {
      setError(err.message)
    } finally {
      setAiLoading(false)
    }
  }

  const handleChat = async (e) => {
    e.preventDefault()
    if (!chatInput) return
    setAiLoading(true)
    try {
      const resp = await geminiService.chatWithAI(chatInput, chatMessages)
      setChatMessages(prev => prev.concat([`User: ${chatInput}`, `AI: ${resp}`]))
      setChatInput('')
    } catch (err) {
      setError(err.message)
    } finally {
      setAiLoading(false)
    }
  }

  return (
    <div className="container">
      <h1 className="title">Todos</h1>
      <TodoForm onAdd={addTodo} loading={loading} />
      {error ? <div className="error">{error}</div> : null}
      {loading ? <div className="loading">Loading...</div> : null}
      <TodoList items={todos} onUpdate={updateTodo} onDelete={deleteTodo} />
      <div className="ai-section">
        <h2>AI Assistant</h2>
        <div style={{display:'flex',gap:8}}>
          <button className="btn" onClick={handleSuggest} disabled={aiLoading}>Suggest Tasks</button>
          <button className="btn" onClick={handleCategorize} disabled={aiLoading}>Categorize & Prioritize</button>
        </div>

        {aiLoading ? <div>AI working...</div> : null}

        {suggestions.length > 0 && (
          <div>
            <h3>Suggestions</h3>
            <ul>
              {suggestions.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
          </div>
        )}

        {categories && (
          <div>
            <h3>Categories / Priorities</h3>
            <pre style={{whiteSpace:'pre-wrap'}}>{typeof categories === 'string' ? categories : JSON.stringify(categories, null, 2)}</pre>
          </div>
        )}

        <form onSubmit={handleChat} style={{marginTop:12}}>
          <input value={chatInput} onChange={e => setChatInput(e.target.value)} placeholder="Ask the AI..." />
          <button className="btn" type="submit" disabled={aiLoading}>Send</button>
        </form>

        {chatMessages.length > 0 && (
          <div>
            <h3>Chat</h3>
            <div style={{whiteSpace:'pre-wrap'}}>{chatMessages.join('\n')}</div>
          </div>
        )}
      </div>

      <button className="btn" onClick={fetchTodos}>Refresh</button>
    </div>
  )
}
