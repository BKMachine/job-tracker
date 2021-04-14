import express from 'express'

const router = express.Router()

router.get('/', (req, res, next) => {
  res.status(200).send('Hello World')
})

router.use((req, res, next) => {
  res.sendStatus(404)
})

export default router
