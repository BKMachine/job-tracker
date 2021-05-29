import Part, { PartDoc } from './part_model'

interface Filter {
  key: string
  value: string
  comparison: 'eq'
}

interface Body {
  filters: Filter[]
}

async function listParts(
  limit = 100,
  page = 1,
  body: Body,
): Promise<PartDoc[]> {
  const query: { [key: string]: any } = {}
  body.filters.forEach((filter) => {
    if (filter.comparison === 'eq') query[filter.key] = filter.value
  })
  console.log(query)
  return Part.find(query)
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
