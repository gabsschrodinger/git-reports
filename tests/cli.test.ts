import { cli } from '../src/cli'
import { faker } from '@faker-js/faker'
import * as args from '../src/args'
import * as reportServiceModule from '../src/ReportService'
import { createReportEntry } from './test.utils'

jest.mock('../src/args', () => ({
  parseArgs: jest.fn().mockReturnValue({
    includeMerges: false,
    includeEmail: false,
    debugMode: false,
    orderBy: 'commits',
    order: 'DESC',
  }),
}))

const generatedReport = Array.from({ length: 25 }, () => createReportEntry())
const reportServiceMethods = {
  processCommits: jest.fn().mockResolvedValue(undefined),
  processLines: jest.fn().mockResolvedValue(undefined),
  getReport: jest.fn().mockReturnValue(generatedReport),
}

jest.mock('../src/ReportService', () => ({
  ReportService: jest.fn().mockImplementation(() => reportServiceMethods),
}))

describe('CLI', () => {
  let rawArgs: string[]

  beforeEach(() => {
    jest.clearAllMocks()
    rawArgs = Array.from({ length: 5 }, () => faker.random.word())
  })

  it('should call parseArgs with the received parameter', async () => {
    const parseArgsSpy = jest.spyOn(args, 'parseArgs')

    await cli(rawArgs)

    expect(parseArgsSpy).toHaveBeenCalledWith(rawArgs)
  })

  it('should instatiate the Report Service class with the parsed args', async () => {
    const reportServiceSpy = jest.spyOn(reportServiceModule, 'ReportService')

    await cli(rawArgs)

    expect(reportServiceSpy).toHaveBeenCalledWith({
      includeMerges: false,
      includeEmail: false,
      debugMode: false,
      orderBy: 'commits',
      order: 'DESC',
    })
  })

  it('should process the commits', async () => {
    await cli(rawArgs)

    expect(reportServiceMethods.processCommits).toHaveBeenCalled()
  })

  it('should process the lines', async () => {
    await cli(rawArgs)

    expect(reportServiceMethods.processLines).toHaveBeenCalled()
  })

  it('should log the generated report in the terminal', async () => {
    const consoleSpy = jest.spyOn(console, 'table')

    await cli(rawArgs)

    expect(consoleSpy).toHaveBeenCalledWith(generatedReport)
  })
})
