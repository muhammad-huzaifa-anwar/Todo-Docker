import axios from 'axios'

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

export const api = axios.create({
  baseURL: `${baseURL}/api`,
})

export const TodosAPI = {
  list: () => api.get('/todos').then(r => r.data),
  create: (data) => api.post('/todos', data).then(r => r.data),
  get: (id) => api.get(`/todos/${id}`).then(r => r.data),
  update: (id, data) => api.put(`/todos/${id}`, data).then(r => r.data),
  remove: (id) => api.delete(`/todos/${id}`),
}
