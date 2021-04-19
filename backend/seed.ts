import * as database from './src/database'
import Count from './src/lib/count/count_model'
import Customer from './src/lib/customer/customer_model'
import Job from './src/lib/job/job_model'
import Part from './src/lib/part/part_model'

async function seed() {
  await database.connect()
  await Count.deleteMany()
  await Customer.deleteMany()
  await Job.deleteMany()
  await Part.deleteMany()

  await new Customer({
    name: 'Customer 1',
    address: '111 Main Street, Some Town, USA',
    contact: 'Amy',
    phone: '(555) 555-1111',
  }).save()

  await new Customer({
    name: 'Customer 2',
    address: '222 Main Street, Some Town, USA',
    contact: 'George',
    phone: '(555) 555-2222',
  }).save()

  await new Customer({
    name: 'Customer 3',
    address: '333 Main Street, Some Town, USA',
    contact: 'Dan',
    phone: '(555) 555-3333',
  }).save()

  await new Customer({
    name: 'Customer 4',
    address: '444 Main Street, Some Town, USA',
    contact: 'Claire',
    phone: '(555) 555-4444',
  }).save()

  await new Customer({
    name: 'Customer 5',
    address: '555 Main Street, Some Town, USA',
    contact: 'Charlie',
    phone: '(555) 555-5555',
  }).save()

  for (let i = 0; i < 1000; i++) {
    await new Job().save()
  }
  console.log('DONE SEEDING')
}

seed()
