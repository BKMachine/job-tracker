import Job, { JobDoc } from './job_model'

async function list(): Promise<JobDoc[]> {
  return Job.find()
}

export default {
  list,
}
