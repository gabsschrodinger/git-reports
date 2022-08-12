import { parseArgs } from "./args";
import { processCommits, processLines } from "./parse";
import { generateReport } from "./report";

export async function cli(args: string[]): Promise<void> {
  const options = parseArgs(args);
  const authors: string[] = [];
  const emails: string[] = [];
  const commits: number[] = [];
  const addedLines: number[] = [];
  const excludedLines: number[] = [];

  await processCommits(authors, emails, commits, options.includeMerges);

  await processLines(authors, addedLines, excludedLines);

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
