import CountService from '../count_service'

describe('count service', () => {
  describe('increment method', () => {
    it('returns 1 if first save', async () => {
      const count = await CountService.increment('foo', 'bar')
      expect(count).toBe(1)
    })

    it('increments on additional calls', async () => {
      await CountService.increment('foo', 'bar')
      const count = await CountService.increment('foo', 'bar')
      expect(count).toBe(2)
    })
  })
})
