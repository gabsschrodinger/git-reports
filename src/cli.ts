import { parseArgs } from "./args";
import { GitReport } from "./GitReport";
import { processLines } from "./parse";
import { generateReport } from "./report";

export async function cli(args: string[]): Promise<void> {
  const options = parseArgs(args);

  const gitReport = new GitReport(options);

  await gitReport.processCommits();

  const { authors, emails, commits, addedLines, excludedLines } = gitReport;

  await processLines(authors, addedLines, excludedLines, options);

  console.table(
    generateReport({
      authors,
      emails,
      commits,
      addedLines,
      excludedLines,
    })
  );
}
