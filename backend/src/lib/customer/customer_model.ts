import { Document, Schema, model } from 'mongoose'

const schema = new Schema({
  name: { type: String, required: true, unique: true },
  address: String,
  contact: String,
  phone: String,
  email: String,
  website: String,
})

export interface CustomerDoc extends Document {
  name: string
  address?: string
  contact?: string
  phone?: string
  email?: string
  website?: string
}

export default model<CustomerDoc>('customers', schema)
