import Part, { PartDoc } from './part_model'

async function listParts(): Promise<PartDoc[]> {
  return Part.find()
}

async function getPart(id: string): Promise<PartDoc | null> {
  return Part.findById(id)
}

async function updatePart(data: PartDoc): Promise<void> {
  await Part.findByIdAndUpdate(data._id, data)
}

export default {
  listParts,
  getPart,
  updatePart,
}
