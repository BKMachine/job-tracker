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
  .delete(async (req, res, next) => {
    const { id } = req.body
    if (!id) return res.sendStatus(400)
    try {
      await CustomerService.remove(id)
      res.sendStatus(204)
    } catch (e) {
      next(e)
    }
  })

export default router
