import express from 'express'
import customerRoutes from './routes/customers'

const router = express.Router()

router.use(customerRoutes)

router.use((req, res, next) => {
  res.sendStatus(404)
})

export default router
