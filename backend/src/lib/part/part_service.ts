import Part, { PartDoc } from './part_model'

async function listParts(): Promise<PartDoc[]> {
  return Part.find()
}

export default {
  listParts,
}
