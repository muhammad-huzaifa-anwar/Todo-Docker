import 'dotenv/config'
import { GoogleGenerativeAI } from '@google/generative-ai'

const API_KEY = process.env.GEMINI_API_KEY

if (!API_KEY) {
  console.warn('GEMINI_API_KEY is not set. Gemini endpoints will fail.')
}

const genAI = new GoogleGenerativeAI(API_KEY)
const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' })

async function callGemini(prompt) {
  if (!API_KEY) throw new Error('Missing GEMINI_API_KEY in server environment')
  const result = await model.generateContent(prompt)
  return result.response.text()
}

export async function suggestTasks(tasks = []) {
  const prompt = `I have these todo tasks: ${tasks.join(', ')}. Suggest 3 more related tasks. Reply ONLY as a JSON array of strings. Example: ["Task 1","Task 2","Task 3"]`
  const raw = await callGemini(prompt)
  const cleaned = raw.replace(/```json|```/g, '').trim()
  try { return JSON.parse(cleaned) }
  catch { return cleaned.split(/\r?\n/).map(s => s.trim()).filter(Boolean) }
}

export async function categorizeTasks(tasks = []) {
  const prompt = `Categorize and prioritize these tasks: ${JSON.stringify(tasks)}. Return ONLY a JSON array where each object has: id, category (Work/Personal/Health/Shopping/Other), priority (High/Medium/Low).`
  const raw = await callGemini(prompt)
  const cleaned = raw.replace(/```json|```/g, '').trim()
  try { return JSON.parse(cleaned) }
  catch { return { raw: cleaned } }
}

export async function chatWithAI(message = '', tasks = []) {
  const prompt = `You are a helpful todo assistant. Current tasks: ${JSON.stringify(tasks)}. User says: "${message}". Help them manage their tasks. Be concise.`
  return await callGemini(prompt)
}

export default { suggestTasks, categorizeTasks, chatWithAI }