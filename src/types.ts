export interface Options {
  includeMerges: boolean;
}

export interface GitReportEntry {
  author: string;
  email?: string;
  commits: number;
  "added lines": number;
  "excluded lines": number;
  "total lines": number;
}

export type GitReport = GitReportEntry[];

export interface GitReportData {
  authors: string[];
  emails: string[];
  commits: number[];
  addedLines: number[];
  excludedLines: number[];
}
