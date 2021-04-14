import mongoose from 'mongoose'
import consola from '../consola'

mongoose.Promise = global.Promise

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
}

export async function connect(mongoUrl?: string): Promise<void> {
  const url = mongoUrl || process.env.MONGO_URL || 'mongodb://localhost:27017'
  await mongoose.connect(url, options).then(() => {
    consola.success('Connected to MongoDB')
  })
}

export async function disconnect(): Promise<void> {
  await mongoose.disconnect().then(() => {
    consola.success('Disconnected from MongoDB')
  })
}
