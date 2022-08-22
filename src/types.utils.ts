import { GitReportEntry, Order } from './types'

export function isOrder(value: string): value is Order {
  return value === 'ASC' || value === 'DESC'
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
