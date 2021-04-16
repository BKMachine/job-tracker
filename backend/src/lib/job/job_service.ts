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

export default {
  listOpenJobs,
  getNextJobNumber,
  getJob,
}
