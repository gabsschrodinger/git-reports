import { promisify } from 'util'
import { exec } from 'child_process'
import { GitReportOptions } from './types'

const execTerminalCommand = promisify(exec)

export class TerminalService {
  private readonly exec: typeof execTerminalCommand
  private readonly options: GitReportOptions

  constructor(options: GitReportOptions, exec = execTerminalCommand) {
    this.options = options
    this.exec = exec
  }

  private getGitShortlogCommand() {
    const baseCommand = 'git shortlog -s -n -e --all'
    const noMergesFlag = this.options.includeMerges ? '--no-merges' : ''

    return baseCommand + noMergesFlag
  }

  async getGitShortlog() {
    const { stdout: shortlog } = await this.exec(this.getGitShortlogCommand())

    return shortlog
  }

  private getGitShortstatCommand(author: string) {
    return `git log --author="${author}" --pretty=tformat: --shortstat`
  }

  async getGitAuthorShortstat(author: string) {
    const { stdout: shortstat } = await this.exec(
      this.getGitShortstatCommand(author)
    )

    return shortstat
  }
}
