import { Document, Schema, model } from 'mongoose'

const schema = new Schema({
  name: String,
  revision: String,
  description: String,
  customer: String,
  inStock: Number,
  stockLocation: String,
})

export interface PartDoc extends Document {
  name: string
  revision: string
  description: string
  customer: string
  inStock: number
  stockLocation: string
}

export default model<PartDoc>('parts', schema)
