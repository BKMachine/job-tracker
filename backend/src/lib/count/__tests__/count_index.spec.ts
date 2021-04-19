import CountService from '../count_service'
import index from '../index'

describe('count index module', () => {
  it('exports the service', () => {
    expect(index).toBe(CountService)
  })
})
