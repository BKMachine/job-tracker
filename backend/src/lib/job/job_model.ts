import { Document, Schema, model } from 'mongoose'
import CountService from '../count'

const schema = new Schema({
  id: { type: Number, unique: true, index: true },
  customer: { type: String },
  closed: { type: Boolean, default: false, index: true },
  part: { type: Schema.Types.ObjectId, ref: 'parts' },
  quantity: Number,
  dueDate: Date,
})

export interface JobDoc extends Document {
  id: number
  customer: string
  closed: boolean
  quantity: number
  dueDate: Date
}

schema.pre('save', async function (next) {
  try {
    this.id = await CountService.increment('jobs', 'id')
  } catch (e) {
    next(e)
  }
  next()
})

export default model<JobDoc>('jobs', schema)
