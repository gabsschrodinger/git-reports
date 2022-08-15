import { TerminalService } from '../src/TerminalService'
import { GitReportOptions } from '../src/types'
import { faker } from '@faker-js/faker'

describe('Terminal Service', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('getGitShortlog', () => {
    it('should call exec with git shortlog command without merge when includeMerges options is false', async () => {
      const execMock = jest.fn().mockResolvedValue({ stdout: '' })
      const terminalService = new TerminalService(
        { includeMerges: false } as GitReportOptions,
        execMock
      )

      await terminalService.getGitShortlog()

      expect(execMock).toHaveBeenCalledWith('git shortlog -s -n -e --all')
    })

    it('should call exec with git shortlog command without merge when includeMerges options is false', async () => {
      const execMock = jest.fn().mockResolvedValue({ stdout: '' })
      const terminalService = new TerminalService(
        { includeMerges: true } as GitReportOptions,
        execMock
      )

      await terminalService.getGitShortlog()

      expect(execMock).toHaveBeenCalledWith(
        'git shortlog -s -n -e --all --no-merges'
      )
    })

    it('should return the stdout property of the exec return value', async () => {
      const stdout = faker.random.word()
      const execMock = jest.fn().mockResolvedValue({ stdout })
      const terminalService = new TerminalService(
        {} as GitReportOptions,
        execMock
      )

      const shortlog = await terminalService.getGitShortlog()

      expect(shortlog).toBe(stdout)
    })
  })

  describe('getGitAuthorShortstat', () => {
    it('should call exec with git shortstat command with the given author', async () => {
      const author = faker.name.fullName()
      const execMock = jest.fn().mockResolvedValue({ stdout: '' })
      const terminalService = new TerminalService(
        {} as GitReportOptions,
        execMock
      )

      await terminalService.getGitAuthorShortstat(author)

      expect(execMock).toHaveBeenCalledWith(
        `git log --author="${author}" --pretty=tformat: --shortstat`
      )
    })

    it('should return the stdout property of the exec return value', async () => {
      const stdout = faker.random.word()
      const execMock = jest.fn().mockResolvedValue({ stdout })
      const terminalService = new TerminalService(
        {} as GitReportOptions,
        execMock
      )

      const shortstat = await terminalService.getGitAuthorShortstat('')

      expect(shortstat).toBe(stdout)
    })
  })
})
