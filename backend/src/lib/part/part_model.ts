import { Document, Schema, model } from 'mongoose'

const schema = new Schema({
  name: String,
  revision: String,
  description: String,
  notes: String,
  customer: String,
  thumbnail: String,
  images: [
    {
      url: String,
      name: String,
    },
  ],
  stock: {
    quantity: Number,
    location: String,
  },
  material: {
    materialType: String,
    shape: String,
    workpiece: String,
    height: Number,
    width: Number,
    diameter: Number,
    partLength: Number,
    cutLength: Number,
  },
})

export interface PartDoc extends Document {
  name: string
  revision: string
  description: string
  notes: string
  customer: string
  thumbnail: string
  images: [{ url: string; name: string }]
  stock: {
    quantity: number
    location: string
  }
  material: {
    materialType: string
    shape: 'round' | 'square'
    workpiece: 'bars' | 'blanks'
    height: number | null
    width: number | null
    diameter: number | null
    partLength: number
    cutLength: number
  }
}

export default model<PartDoc>('parts', schema)
