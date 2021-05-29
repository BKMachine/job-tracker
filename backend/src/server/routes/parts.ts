import express from 'express'
import PartService from '../../lib/part'

const router = express.Router()

router.post('/parts', async (req, res, next) => {
  const { limit, page } = req.query
  const limitNum = parseInt(limit as string)
  const pageNum = parseInt(page as string)
  const l = Number.isNaN(limitNum) ? undefined : limitNum
  const p = Number.isNaN(pageNum) ? undefined : pageNum
  try {
    const total = await PartService.partsCount()
    const parts = await PartService.listParts(l, p, req.body)
    res.status(200).json({ total, parts })
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
