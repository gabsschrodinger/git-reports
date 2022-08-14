import { parseArgs } from './args'
import { GitReport } from './GitReport'

export async function cli(args: string[]): Promise<void> {
  const options = parseArgs(args)

  const gitReport = new GitReport(options)

  await gitReport.processCommits()
  await gitReport.processLines()

  console.table(gitReport.getReport())
}
