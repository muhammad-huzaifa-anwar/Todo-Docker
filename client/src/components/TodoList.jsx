import TodoItem from './TodoItem.jsx'

export default function TodoList({ items, onUpdate, onDelete }) {
  if (!items.length) return <div className="empty">No todos</div>
  return (
    <div className="list">
      {items.map((t) => (
        <TodoItem key={t._id} item={t} onUpdate={onUpdate} onDelete={onDelete} />
      ))}
    </div>
  )
}
