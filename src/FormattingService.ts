import {
  GitReport,
  GitReportData,
  GitReportEntry,
  GitReportOptions,
} from './types'
import { groupUsersBy, sortNumbericValues, sortStringValues } from './utils'

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
        sortNumbericValues(a[field], b[field], this.options.order)
      )
    }
  }

  generateReport({
    authors,
    emails,
    commits,
    addedLines,
    excludedLines,
  }: GitReportData): GitReport {
    for (let i = 0; i < authors.length; i++) {
      const entry: GitReportEntry = {
        author: authors[i],
        email: emails[i],
        commits: commits[i],
        'added lines': addedLines[i],
        'excluded lines': excludedLines[i],
        'total lines': Number(addedLines[i]) + Number(excludedLines[i]),
      }

      this.reportEntries.push(entry)
    }

    this.groupUsersByEmail()

    this.sortReport()

    if (!this.options.includeEmail) {
      return this.getReportWithoutEmail()
    }

    return this.reportEntries
  }
}
