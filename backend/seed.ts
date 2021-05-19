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
    email: 'cust1@customers.com',
  }).save()

  await new Customer({
    name: 'Customer 2',
    address: '222 Main Street, Some Town, USA',
    contact: 'George',
    phone: '(555) 555-2222',
    email: 'cust2@customers.com',
  }).save()

  await new Customer({
    name: 'Customer 3',
    address: '333 Main Street, Some Town, USA',
    contact: 'Dan',
    phone: '(555) 555-3333',
    email: 'cust3@customers.com',
  }).save()

  await new Customer({
    name: 'Customer 4',
    address: '444 Main Street, Some Town, USA',
    contact: 'Claire',
    phone: '(555) 555-4444',
    email: 'cust4@customers.com',
  }).save()

  await new Customer({
    name: 'Customer 5',
    address: '555 Main Street, Some Town, USA',
    contact: 'Charlie',
    phone: '(555) 555-5555',
    email: 'cust5@customers.com',
  }).save()

  await new Part({
    name: 'Part 1',
    revision: 'A',
    description: 'Part Description',
    notes: 'Part Notes',
    customer: 'Customer 1',
    stock: {
      quantity: 200,
      location: 'A-1',
    },
    material: {
      materialType: '6061',
      shape: 'square',
      height: 1.75,
      width: 0.5,
      partLength: 2.5,
      cutLength: 2.65,
    },
  }).save()

  await new Part({
    name: 'Part 2',
    revision: 'B',
    description: 'Part Description',
    notes: 'Part Notes',
    customer: 'Customer 2',
    stock: {
      quantity: 10,
      location: 'C-11',
    },
    material: {
      materialType: '12L14',
      shape: 'round',
      workpiece: 'bars',
      diameter: 2.5,
      partLength: 2.5,
      cutLength: 36.5,
    },
  }).save()

  await new Part({
    name: 'Part 3',
    revision: '2',
    description: 'Part Description',
    notes: 'Part Notes',
    customer: 'Customer 1',
    stock: {
      quantity: 2000,
      location: 'A-2',
    },
    material: {
      materialType: '416SS',
      shape: 'round',
      workpiece: 'blanks',
      diameter: 1.5,
      partLength: 1.5,
      cutLength: 1.65,
    },
  }).save()

  /*  for (let i = 0; i < 1000; i++) {
    await new Job().save()
  }*/
  console.log('DONE SEEDING')
}

seed()
