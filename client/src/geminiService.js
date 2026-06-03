// Client-side proxy to server Gemini endpoints (server keeps the API key)
const BASE = '/api/gemini'

async function post(path, body) {
  const res = await fetch(`${BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  })
  if (!res.ok) {
    const txt = await res.text()
    throw new Error(`Server error: ${res.status} ${txt}`)
  }
  return res.json()
}

export async function suggestTasks(tasks) {
  const data = await post('/suggest', { tasks })
  return data.suggestions
}

export async function categorizeTasks(tasks) {
  const data = await post('/categorize', { tasks })
  return data.categorized
}

export async function chatWithAI(message, tasks) {
  const data = await post('/chat', { message, tasks })
  return data.reply
}

export default { suggestTasks, categorizeTasks, chatWithAI }
