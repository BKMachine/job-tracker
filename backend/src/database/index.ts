import mongoose from 'mongoose'
import autoIncrement from 'mongoose-auto-increment'
import consola from '../consola'

mongoose.Promise = global.Promise
autoIncrement.initialize(mongoose.connection)

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
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
