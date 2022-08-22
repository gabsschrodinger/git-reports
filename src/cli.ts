import { parseArgs } from './args'
import { ReportService } from './ReportService'

export async function cli(args: string[]): Promise<void> {
  const options = parseArgs(args)

  const gitReport = new ReportService(options)

  await gitReport.processCommits()
  await gitReport.processLines()

  console.table(gitReport.getReport())
}
