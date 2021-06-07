import express from 'express'
import CustomerService from '../../lib/customer'

const router = express.Router()

router
  .route('/customers')
  .get(async (req, res, next) => {
    try {
      const customers = await CustomerService.list()
      res.status(200).json(customers)
    } catch (e) {
      next(e)
    }
  })
  .post(async (req, res, next) => {
    try {
      const newCustomer = await CustomerService.add(req.body)
      res.status(202).json(newCustomer)
    } catch (e) {
      next(e)
    }
  })
  .put(async (req, res, next) => {
    try {
      const newCustomer = await CustomerService.update(req.body)
      res.status(202).json(newCustomer)
    } catch (e) {
      next(e)
    }
  })

router.get('/customers/names', async (req, res, next) => {
  try {
    const names = await CustomerService.listNames()
    res.status(200).json(names)
  } catch (e) {
    next(e)
  }
})

export default router
