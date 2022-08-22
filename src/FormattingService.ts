import { GitReport, GitReportEntry, GitReportOptions } from './types'
import { groupUsersBy, sortNumericValues, sortStringValues } from './utils'

export class FormattingService {
  private reportEntries: GitReportEntry[] = []
  private readonly options: GitReportOptions

  constructor(options: GitReportOptions) {
    this.options = options
  }

  private groupUsersByEmail() {
    this.reportEntries = groupUsersBy('email')(this.reportEntries)
  }

  private getReportWithoutEmail() {
    return this.reportEntries.map((entry) => {
      const newEntry: Partial<GitReportEntry> = { ...entry }
      delete newEntry.email

      return newEntry
    })
  }

  private sortReport() {
    const field = this.options.orderBy
    if (field === 'author' || field === 'email') {
      this.reportEntries = this.reportEntries.sort((a, b) =>
        sortStringValues(a[field], b[field], this.options.order)
      )
    } else {
      this.reportEntries = this.reportEntries.sort((a, b) =>
        sortNumericValues(a[field], b[field], this.options.order)
      )
    }
  }

  generateReport(entries: GitReportEntry[]): GitReport {
    this.reportEntries = entries

    this.groupUsersByEmail()

    this.sortReport()

    if (!this.options.includeEmail) {
      return this.getReportWithoutEmail()
    }

    return this.reportEntries
  }
}
