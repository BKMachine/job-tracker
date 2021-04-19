import { MongoMemoryServer } from 'mongodb-memory-server'
import { connection } from 'mongoose'
import * as database from './src/database'

let mongo: MongoMemoryServer

beforeAll(async () => {
  mongo = new MongoMemoryServer({})
  await database.connect(await mongo.getUri())
})

beforeEach(async () => {
  const collections = await connection.db.collections()
  collections.map((collection) => collection.deleteMany({}))
})

afterAll(async () => {
  await database.disconnect()
  await mongo.stop()
})
