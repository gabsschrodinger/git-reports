export interface Options {
  includeMerges: boolean;
}

interface GitReportEntry {
  author: string;
  commits: number;
  "added lines": number;
  "excluded lines": number;
  "total lines": number;
}

export type GitReport = GitReportEntry[];

export interface GitReportOptions {
  authors: string[];
  commits: number[];
  addedLines: number[];
  excludedLines: number[];
}
