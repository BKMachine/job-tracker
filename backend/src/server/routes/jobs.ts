import express from 'express'
import JobService from '../../lib/job'

const router = express.Router()

router.get('/jobs/open', async (req, res, next) => {
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
    return res.status(400).json({ message: 'The Job ID must be a number.' })
  try {
    const job = await JobService.getJob(parseInt(req.params.id))
    if (!job) return res.sendStatus(404)
    res.status(200).json(job)
  } catch (e) {
    next(e)
  }
})

router.post('/jobs', async (req, res, next) => {
  try {
    const newJob = await JobService.create(req.body)
    res.status(201).json(newJob)
  } catch (e) {
    next(e)
  }
})

router.get('/jobs', async (req, res, next) => {
  const { limit, page } = req.query
  const limitNum = parseInt(limit as string)
  const pageNum = parseInt(page as string)
  const l = Number.isNaN(limitNum) ? undefined : limitNum
  const p = Number.isNaN(pageNum) ? undefined : pageNum
  try {
    const total = await JobService.jobsCount()
    const jobs = await JobService.getJobs(l, p)
    res.status(200).json({ total, jobs })
  } catch (e) {
    next(e)
  }
})

export default router
