import express from 'express'
import JobService from '../../lib/job'

const router = express.Router()

router.route('/jobs').get(async (req, res, next) => {
  try {
    const jobs = await JobService.list()
    res.status(200).json(jobs)
  } catch (e) {
    next(e)
  }
})

export default router
