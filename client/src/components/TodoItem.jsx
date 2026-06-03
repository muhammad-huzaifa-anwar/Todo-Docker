import { useState } from 'react'

export default function TodoItem({ item, onUpdate, onDelete }) {
  const [editing, setEditing] = useState(false)
  const [title, setTitle] = useState(item.title)
  const [description, setDescription] = useState(item.description || '')

  const toggleCompleted = () => {
    onUpdate(item._id, { completed: !item.completed })
  }

  const save = () => {
    onUpdate(item._id, { title, description })
    setEditing(false)
  }

  return (
    <div className={`todo ${item.completed ? 'todo--done' : ''}`}>
      <div className="todo-main">
        <input type="checkbox" checked={item.completed} onChange={toggleCompleted} />
        {editing ? (
          <div className="todo-edit">
            <input className="input" value={title} onChange={(e) => setTitle(e.target.value)} />
            <input className="input" value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>
        ) : (
          <div className="todo-text">
            <div className="todo-title">{item.title}</div>
            {item.description ? <div className="todo-desc">{item.description}</div> : null}
          </div>
        )}
      </div>
      <div className="todo-actions">
        {editing ? (
          <button className="btn" onClick={save}>Save</button>
        ) : (
          <button className="btn" onClick={() => setEditing(true)}>Edit</button>
        )}
        <button className="btn btn--danger" onClick={() => onDelete(item._id)}>Delete</button>
      </div>
    </div>
  )
}
