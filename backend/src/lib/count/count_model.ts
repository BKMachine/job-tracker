import { Document, Schema, model } from 'mongoose'

const schema = new Schema({
  modelName: String,
  fieldName: String,
  count: Number,
})

export interface CountDoc extends Document {
  modelName: string
  fieldName: string
  count: number
}

export default model<CountDoc>('counts', schema)
