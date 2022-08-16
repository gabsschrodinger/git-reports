import { TerminalService } from './TerminalService'
import { GitReportEntry, GitReportOptions } from './types'
import { FormattingService } from './FormattingService'
import { groupUsersBy } from './utils'

export class GitReport {
  private entries: GitReportEntry[] = []
  private readonly options: GitReportOptions
  private readonly formattingService: FormattingService
  private readonly terminalService: TerminalService

  constructor(options: GitReportOptions) {
    this.options = options
    this.formattingService = new FormattingService(options)
    this.terminalService = new TerminalService(options)
  }

  async processCommits(): Promise<void> {
    const authors: string[] = []
    const emails: string[] = []
    const commits: number[] = []

    const gitShortlog = await this.terminalService.getGitShortlog()

    if (this.options.debugMode) {
      console.log('>>> DEBUG:', gitShortlog)
    }

    const commitsReportArr = gitShortlog.trim().replace("'", '').split(/\s+/)

    commitsReportArr.forEach((str: string) => {
      if (/^\d+$/.test(str)) {
        commits.push(Number(str))
      } else if (/\S+@\S+\.\S+/.test(str)) {
        emails.push(str)
      } else if (commits.length > authors.length) {
        authors.push(str)
      } else {
        authors[authors.length - 1] = authors[authors.length - 1] + ' ' + str
      }
    })

    this.entries = groupUsersBy('author')(
      authors.map((author, index) => ({
        author,
        email: emails[index],
        commits: commits[index],
        'added lines': 0,
        'excluded lines': 0,
        'total lines': 0,
      }))
    )
  }

  private getAddedLinesFromUser(shortstatLog: string) {
    const addedLinesRegex = /\d+(?=\s+insertion)/g

    const addedLinesCollection = shortstatLog.match(addedLinesRegex)

    if (!addedLinesCollection) {
      return 0
    }

    return addedLinesCollection
      .map((addedLines) => Number(addedLines))
      .reduce((sum, addedLines) => sum + addedLines, 0)
  }

  private getDeletedLinesFromUser(shortstatLog: string) {
    const deletedLinesRegex = /\d+(?=\s+deletion)/g

    const deletedLinesCollection = shortstatLog.match(deletedLinesRegex)

    if (!deletedLinesCollection) {
      return 0
    }

    return deletedLinesCollection
      .map((deletedLines) => Number(deletedLines))
      .reduce((sum, deletedLines) => sum + deletedLines, 0)
  }

  async processLines() {
    for (const entry of this.entries) {
      const authorShortstat = await this.terminalService.getGitAuthorShortstat(
        entry.author
      )

      if (this.options.debugMode) {
        console.log('>>> DEBUG:', authorShortstat)
      }

      entry['added lines'] = this.getAddedLinesFromUser(authorShortstat)
      entry['excluded lines'] = this.getDeletedLinesFromUser(authorShortstat)
      entry['total lines'] = entry['added lines'] + entry['excluded lines']
    }
  }

  getReport() {
    return this.formattingService.generateReport(this.entries)
  }
}
