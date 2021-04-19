import Customer, { CustomerDoc } from './customer_model'

async function list(): Promise<CustomerDoc[]> {
  return Customer.find()
}

async function add(data: unknown): Promise<CustomerDoc> {
  const customer = new Customer(data)
  return customer.save()
}

async function update(data: CustomerDoc): Promise<CustomerDoc> {
  const updatedCustomer = await Customer.findByIdAndUpdate(data._id, data, {
    new: true,
  })
  if (!updatedCustomer) throw new Error('Customer not found')
  return updatedCustomer
}

async function remove(id: string): Promise<void> {
  await Customer.findByIdAndRemove(id)
}

async function listNames(): Promise<string[]> {
  const docs = await Customer.find({}, 'name')
  return docs
    .map((customer) => customer.name)
    .sort((a, b) => {
      const c = a.toLowerCase()
      const d = b.toLowerCase()
      if (c < d) return -1
      if (c > d) return 1
      return 0
    })
}

export default {
  list,
  add,
  update,
  remove,
  listNames,
}
