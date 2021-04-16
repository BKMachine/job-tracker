import express from 'express'
import PartService from '../../lib/part'

const router = express.Router()

router.get('/parts', async (req, res, next) => {
  try {
    const parts = await PartService.listParts()
    res.status(200).json(parts)
  } catch (e) {
    next(e)
  }
})

export default router
