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

  for (const author of authors) {
    const linesArr = await processLines(author, options.useAwk);
    addedLines.push(Number(linesArr[0]));
    excludedLines.push(Number(linesArr[1]));
  }

  const report: GitReport = generateReport({
    authors,
    commits,
    addedLines,
    excludedLines,
  });

  console.table(report);
}
