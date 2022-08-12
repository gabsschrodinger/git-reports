import { parseArgs } from "./args";
import { processCommits, processLines } from "./parse";
import { generateReport } from "./report";
import { GitReport } from "./types";

export async function cli(args: string[]): Promise<void> {
  const options = parseArgs(args);
  const authors: string[] = [];
  const commits: number[] = [];
  const addedLines: number[] = [];
  const excludedLines: number[] = [];

  await processCommits(authors, commits, options.includeMerges);

  await processLines(authors, addedLines, excludedLines);

  const report: GitReport = generateReport({
    authors,
    commits,
    addedLines,
    excludedLines,
  });

  console.table(report);
}
