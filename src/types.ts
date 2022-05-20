export interface Options {
  useAwk: boolean;
  includeMerges: boolean;
}

export enum OperationalSystems {
  MAC = "macos",
  WINDOWS = "windows",
  LINUX = "linux",
}

export type OperationalSystem = `${OperationalSystems}`;

export interface GitReportEntry {
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
