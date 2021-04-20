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

router.get('/part/:id', async (req, res, next) => {
  try {
    const part = await PartService.getPart(req.params.id)
    if (!part) return res.sendStatus(404)
    res.status(200).json(part)
  } catch (e) {
    next(e)
  }
})

router.put('/part', async (req, res, next) => {
  try {
    await PartService.updatePart(req.body)
    res.sendStatus(204)
  } catch (e) {
    next(e)
  }
})

export default router
