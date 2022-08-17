import { faker } from '@faker-js/faker'
import { GitReportEntry, GitReportOptions } from '../src/types'

export function createReportEntry(email?: string): GitReportEntry {
  return {
    author: faker.name.fullName(),
    commits: faker.datatype.number(),
    email: email ?? faker.internet.email(),
    'added lines': faker.datatype.number(),
    'excluded lines': faker.datatype.number(),
    'total lines': faker.datatype.number(),
  }
}

export function filter<T, K extends keyof T>(report: T[]) {
  return {
    by: function (field: K, value: T[K]) {
      return report.filter((entry) => entry[field] === value)
    },
  }
}

export function getReportOptions(
  options: Partial<GitReportOptions> = {}
): GitReportOptions {
  return {
    debugMode: false,
    includeEmail: false,
    includeMerges: false,
    order: 'DESC',
    orderBy: 'commits',
    ...options,
  }
}
