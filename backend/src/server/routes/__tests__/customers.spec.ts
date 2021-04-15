import supertest from 'supertest'
import CustomerService from '../../../lib/customer'
import app from '../../../server'

const request = supertest(app)

describe('customer routes', () => {
  describe('GET /customers', () => {
    test('200', (done) => {
      jest.spyOn(CustomerService, 'list').mockImplementation(() => {
        return Promise.resolve([])
      })
      request.get('/customers').expect(200, [], done)
    })

    test('500', (done) => {
      jest.spyOn(CustomerService, 'list').mockImplementation(() => {
        throw new Error('Mock Error')
      })
      request.get('/customers').expect(500, done)
    })
  })

  describe('DELETE /customers', () => {
    test('400 - no id', (done) => {
      request.delete('/customers').send({}).expect(400, done)
    })

    test('204', (done) => {
      jest.spyOn(CustomerService, 'remove').mockImplementation(() => {
        return Promise.resolve()
      })
      request.delete('/customers').send({ id: 'foo' }).expect(204, done)
    })

    test('500', (done) => {
      jest.spyOn(CustomerService, 'remove').mockImplementation(() => {
        throw new Error('Mock Error')
      })
      request.delete('/customers').send({ id: 'foo' }).expect(500, done)
    })
  })
})
