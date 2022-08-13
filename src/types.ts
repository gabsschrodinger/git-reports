export interface GitReportOptions {
  includeMerges: boolean;
  includeEmail: boolean;
  debugMode: boolean;
  orderBy: keyof GitReportEntry;
  order: "ASC" | "DESC";
}

export interface GitReportEntry {
  author: string;
  email?: string;
  commits: number;
  "added lines": number;
  "excluded lines": number;
  "total lines": number;
}

export function isGitReportEntryKey(
  value: string
): value is keyof GitReportEntry {
  const gitReportEntryKeys = [
    "author",
    "email",
    "commits",
    "added lines",
    "excluded lines",
    "total lines",
  ];

  return gitReportEntryKeys.includes(value);
}

export type GitReport = GitReportEntry[];

export interface GitReportData {
  authors: string[];
  emails: string[];
  commits: number[];
  addedLines: number[];
  excludedLines: number[];
}
