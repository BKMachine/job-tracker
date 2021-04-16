import express from 'express'
import JobService from '../../lib/job'

const router = express.Router()

router.get('/jobs', async (req, res, next) => {
  try {
    const jobs = await JobService.listOpenJobs()
    res.status(200).json(jobs)
  } catch (e) {
    next(e)
  }
})

router.get('/jobs/next', async (req, res, next) => {
  try {
    const next = await JobService.getNextJobNumber()
    res.status(200).send(next.toString())
  } catch (e) {
    next(e)
  }
})

router.get('/job/:id', async (req, res, next) => {
  if (!/^\d+$/.test(req.params.id))
    return res.status(400).json({ message: 'Only numbers allowed in Job ID' })
  try {
    const job = await JobService.getJob(req.params.id)
    if (!job) return res.sendStatus(404)
    res.status(200).json(job)
  } catch (e) {
    next(e)
  }
})

export default router
