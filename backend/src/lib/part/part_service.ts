import Part, { PartDoc } from './part_model'

async function listParts(limit = 100, page = 1): Promise<PartDoc[]> {
  return Part.find()
    .limit(limit)
    .skip(limit * (page - 1))
    .sort({
      id: 'asc',
    })
}

async function partsCount(): Promise<number> {
  return Part.countDocuments()
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
  partsCount,
}
