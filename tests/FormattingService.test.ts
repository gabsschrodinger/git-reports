import { GitReportEntry, GitReportOptions } from '../src/types'
import { faker } from '@faker-js/faker'
import { FormattingService } from '../src/FormattingService'

describe('Formatting Service', () => {
  const createReportEntry = (email?: string): GitReportEntry => ({
    author: faker.name.fullName(),
    commits: faker.datatype.number(),
    email: email ?? faker.internet.email(),
    'added lines': faker.datatype.number(),
    'excluded lines': faker.datatype.number(),
    'total lines': faker.datatype.number(),
  })

  describe('generateReport', () => {
    it('should group users by email', () => {
      const sameEmail = faker.internet.email()
      const firstDuplicateEmailEntry = createReportEntry(sameEmail)
      const secondDuplicateEmailEntry = createReportEntry(sameEmail)
      const reportEntries: GitReportEntry[] = [
        firstDuplicateEmailEntry,
        createReportEntry(),
        secondDuplicateEmailEntry,
        createReportEntry(),
      ]
      const reportEntriesCopy: GitReportEntry[] = [...reportEntries]

      const formattingService = new FormattingService({
        orderBy: 'commits',
        order: 'DESC',
        includeEmail: true,
      } as GitReportOptions)

      const formattedReport = formattingService.generateReport(reportEntries)

      expect(formattedReport.length).toBe(reportEntriesCopy.length - 1)
      expect(
        formattedReport.filter(
          (entry) => entry.author === firstDuplicateEmailEntry.author
        ).length
      ).toBe(1)
      expect(
        formattedReport.filter(
          (entry) => entry.author === firstDuplicateEmailEntry.author
        )[0]
      ).toEqual<Partial<GitReportEntry>>({
        author: firstDuplicateEmailEntry.author,
        email: sameEmail,
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
