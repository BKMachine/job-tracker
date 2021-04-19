import Count from '../count_model'

describe('count model', () => {
  it('can make a document with all fields', () => {
    const doc = new Count({
      modelName: 'foo',
      fieldName: 'bar',
      count: 1,
    })
    expect(doc).toMatchObject({
      modelName: 'foo',
      fieldName: 'bar',
      count: 1,
    })
  })

  it('can save a document', async () => {
    await new Count().save()
    const count = await Count.countDocuments()
    expect(count).toBe(1)
  })

  it('can update a document', async () => {
    const doc = await new Count({ count: 1 }).save()
    doc.count = 2
    await doc.save()
    const actual = await Count.find()
    expect(actual[0].count).toBe(2)
  })

  it('can delete a document', async () => {
    const doc = await new Count().save()
    expect(await Count.countDocuments()).toBe(1)
    await doc.delete()
    expect(await Count.countDocuments()).toBe(0)
  })
})
