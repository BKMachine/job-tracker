import * as database from './src/database'
import Count from './src/lib/count/count_model'
import Job from './src/lib/job/job_model'

async function seed() {
  await database.connect('mongodb://localhost:27017')
  await Job.deleteMany()
  await Count.deleteMany()

  for (let i = 0; i < 10; i++) {
    await new Job().save()
  }
  console.log('DONE SEEDING')
}

seed()
