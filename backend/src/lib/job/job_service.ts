import Job, { JobDoc } from './job_model'

async function listOpenJobs(): Promise<JobDoc[]> {
  return Job.find({ closed: false })
}

function getNextJobNumber(): Promise<number> {
  return new Promise((resolve, reject) => {
    Job.nextCount((err, count) => {
      if (err) reject(err)
      resolve(count)
    })
  })
}

async function getJob(id: number): Promise<JobDoc | null> {
  return Job.findOne({ id })
}

async function create(data: unknown): Promise<JobDoc> {
  return new Job(data).save()
}

async function getJobs(limit = 100, page = 1): Promise<JobDoc[]> {
  return Job.find()
    .populate('part')
    .limit(limit)
    .skip(limit * (page - 1))
    .sort({
      id: 'asc',
    })
}

async function jobsCount(): Promise<number> {
  return Job.countDocuments()
}

export default {
  listOpenJobs,
  getNextJobNumber,
  getJob,
  create,
  getJobs,
  jobsCount,
}
