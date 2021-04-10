import * as id from './id'

describe('/util/id', () => {
  describe('generateId()', () => {
    it('generates a valid id', () => {
      const generated = id.generateId()
      expect(id.normalize(generated)).toBe(generated)
    })

    it('ids are unique', () => {
      const id1 = id.generateId()
      const id2 = id.generateId()

      expect(id.normalize(id1)).toEqual(id1)
      expect(id.normalize(id2)).toEqual(id2)
      expect(id1).not.toEqual(id2)
    })
  })

  describe('validate()', () => {
    it('valid id', () => {
      const id1 = id.generateId()
      expect(id.validate(id1)).toBeUndefined()
    })

    it('invalid id', () => {
      expect(() => id.validate('invalid')).toThrow()
    })
  })

  describe('normalize()', () => {
    it('valid id', () => {
      const id1 = id.generateId()
      expect(id.normalize(id1)).toEqual(id1)
      expect(id.normalize(id1.toUpperCase())).toEqual(id1)
    })

    it('invalid id', () => {
      expect(() => id.normalize('invalid')).toThrow()
    })
  })
})
