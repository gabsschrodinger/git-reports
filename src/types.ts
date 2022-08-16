export type Order = 'ASC' | 'DESC'

export function isOrder(value: string): value is Order {
  return value === 'ASC' || value === 'DESC'
}

export interface GitReportEntry {
  author: string
  email: string
  commits: number
  'added lines': number
  'excluded lines': number
  'total lines': number
}

export interface GitReportOptions {
  includeMerges: boolean
  includeEmail: boolean
  debugMode: boolean
  orderBy: keyof GitReportEntry
  order: Order
}

export function isGitReportEntryKey(
  value: string
): value is keyof GitReportEntry {
  const gitReportEntryKeys = [
    'author',
    'email',
    'commits',
    'added lines',
    'excluded lines',
    'total lines',
  ]

  return gitReportEntryKeys.includes(value)
}

export type GitReport = Partial<GitReportEntry>[]
