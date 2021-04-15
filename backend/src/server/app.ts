import express from 'express'
import customerRoutes from './routes/customers'
import jobRoutes from './routes/jobs'

const router = express.Router()

router.use(customerRoutes)
router.use(jobRoutes)

router.use((req, res, next) => {
  res.sendStatus(404)
})

export default router
