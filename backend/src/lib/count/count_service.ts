import Count from './count_model'

async function increment(
  modelName: string,
  fieldName: string,
): Promise<number> {
  const existingDoc = await Count.findOne({ modelName, fieldName })
  if (existingDoc) {
    existingDoc.count++
    await existingDoc.save()
    return existingDoc.count
  } else {
    const newDoc = new Count({ modelName, fieldName, count: 1 })
    await newDoc.save()
    return newDoc.count
  }
}

export default {
  increment,
}
