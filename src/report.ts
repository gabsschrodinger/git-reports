import { GitReport, GitReportOptions } from "./types";

export const generateReport = (options: GitReportOptions): GitReport => {
  const { authors, commits, addedLines, excludedLines } = options;
  const table = [];

  for (let i = 0; i < authors.length; i++) {
    const entry = {
      author: authors[i],
      commits: commits[i],
      "added lines": addedLines[i],
      "excluded lines": excludedLines[i],
      "total lines": Number(addedLines[i]) + Number(excludedLines[i]),
    };

    table.push(entry);
  }

  return table;
};
