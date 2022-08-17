import { GitReportEntry } from '../src/types'
import { faker } from '@faker-js/faker'
import { FormattingService } from '../src/FormattingService'
import { createReportEntry, filter, getReportOptions } from './test.utils'

describe('Formatting Service', () => {
  describe('generateReport', () => {
    it('should group users by email', () => {
      const sameEmail = faker.internet.email()
      const firstDuplicateEmailEntry = createReportEntry(sameEmail)
      const secondDuplicateEmailEntry = createReportEntry(sameEmail)
      const reportEntries = [
        firstDuplicateEmailEntry,
        createReportEntry(),
        secondDuplicateEmailEntry,
        createReportEntry(),
      ]
      const reportEntriesCopy: GitReportEntry[] = [...reportEntries]

      const formattingService = new FormattingService(getReportOptions())

      const formattedReport = formattingService.generateReport(reportEntries)
      const filteredReport = filter(formattedReport).by(
        'author',
        firstDuplicateEmailEntry.author
      )

      expect(formattedReport.length).toBe(reportEntriesCopy.length - 1)
      expect(filteredReport.length).toBe(1)
      expect(filteredReport[0]).toEqual<Partial<GitReportEntry>>({
        author: firstDuplicateEmailEntry.author,
        commits:
          firstDuplicateEmailEntry.commits + secondDuplicateEmailEntry.commits,
        'added lines':
          firstDuplicateEmailEntry['added lines'] +
          secondDuplicateEmailEntry['added lines'],
        'excluded lines':
          firstDuplicateEmailEntry['excluded lines'] +
          secondDuplicateEmailEntry['excluded lines'],
        'total lines':
          firstDuplicateEmailEntry['total lines'] +
          secondDuplicateEmailEntry['total lines'],
      })
    })
  })
})
