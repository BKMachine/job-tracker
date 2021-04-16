import { Document, Schema, model } from 'mongoose'
import autoIncrement from 'mongoose-auto-increment'

const schema = new Schema({
  id: { type: Number, unique: true, index: true },
  customer: { type: String },
  closed: { type: Boolean, default: false, index: true },
})

export interface JobDoc extends Document {
  id: number
  customer: string
  closed: boolean
}

schema.plugin(autoIncrement.plugin, {
  model: 'jobs',
  field: 'id',
  startAt: 1,
})

export default model<JobDoc>('jobs', schema)
