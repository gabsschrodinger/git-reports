import { TerminalService } from '../src/TerminalService'
import { GitReportOptions } from '../src/types'

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
  })
})
