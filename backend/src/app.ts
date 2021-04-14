import * as database from './database'
import * as server from './server/index'

export async function start(): Promise<void> {
  await database.connect()
  server.listen()
}

export async function stop(): Promise<void> {
  await database.disconnect()
}
