
import mongoose from 'mongoose'
import { MongoMemoryServer } from 'mongodb-memory-server'

export const connectDB = async () => {
  const uri = process.env.MONGO_URI
  try {
    if (uri) {
      await mongoose.connect(uri, { autoIndex: true })
      console.log('Connected to MongoDB')
      return
    }
    throw new Error('MONGO_URI is not set')
  } catch (err) {
    console.warn('Primary MongoDB connection failed, starting in-memory MongoDB for development...')
    const mem = await MongoMemoryServer.create()
    const memUri = mem.getUri()
    await mongoose.connect(memUri)
    console.log('Connected to in-memory MongoDB')
   

  }
}

