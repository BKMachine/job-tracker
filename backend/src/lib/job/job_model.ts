import { Document, Schema, model } from 'mongoose'
import autoIncrement from 'mongoose-auto-increment'

const schema = new Schema({
  customer: { type: Schema.Types.ObjectId, ref: 'customers' },
})

export interface JobDoc extends Document {
  customer: string
}

schema.plugin(autoIncrement.plugin, { model: 'jobs', startAt: 1 })

export default model<JobDoc>('jobs', schema)
