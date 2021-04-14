import cors from 'cors'
import express from 'express'
import helmet from 'helmet'
import morgan from 'morgan'
import * as config from '../config'
import consola from '../consola'
import App from './app'

const app = express()

app.use(express.json())
app.use(helmet())
app.use(
  cors({
    origin: config.appUrl,
    credentials: true,
  }),
)
app.use(morgan('dev'))

app.use(App)

export function listen(): void {
  const port = process.env.PORT || 3000
  app.listen(port)
  consola.success({ message: `Listening on port: ${port}`, badge: true })
}
