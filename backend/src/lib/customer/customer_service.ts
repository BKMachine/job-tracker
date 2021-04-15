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

export default {
  list,
  add,
  update,
  remove,
}
