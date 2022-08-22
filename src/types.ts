export type Order = 'ASC' | 'DESC'

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

export type GitReport = Partial<GitReportEntry>[]
