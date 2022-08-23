import { isGitReportEntryKey, isOrder } from '../src/types.utils'
import { faker } from '@faker-js/faker'

describe('Types Utils', () => {
  describe('isOrder', () => {
    it.each([['ASC'], ['DESC']])(
      'should return true for valid string (%s)',
      (value) => {
        const result = isOrder(value)

        expect(result).toBe(true)
      }
    )

    it.each([
      [faker.random.word()],
      [faker.name.firstName()],
      [faker.company.name()],
    ])('should return false for invalid string (%s)', (value) => {
      const result = isOrder(value)

      expect(result).toBe(false)
    })
  })

  describe('isGitReportEntryKey', () => {
    it.each([
      ['author'],
      ['email'],
      ['commits'],
      ['added lines'],
      ['excluded lines'],
      ['total lines'],
    ])('should return true for valid string (%s)', (value) => {
      const result = isGitReportEntryKey(value)

      expect(result).toBe(true)
    })

    it.each([
      [faker.random.word()],
      [faker.name.firstName()],
      [faker.company.name()],
      [faker.random.alpha(8)],
      [faker.random.alphaNumeric(8)],
    ])('should return false for invalid string (%s)', (value) => {
      const result = isGitReportEntryKey(value)

      expect(result).toBe(false)
    })
  })
})
