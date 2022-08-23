import { GitReportEntry, Order } from './types'

export function groupUsersBy(field: keyof GitReportEntry) {
  return function (report: GitReportEntry[]) {
    let newReport = [...report]
    const fieldCollectionCopy = [...report.map((entry) => entry[field])]

    while (fieldCollectionCopy.length) {
      const removedValue = fieldCollectionCopy.shift()

      if (fieldCollectionCopy.includes(removedValue!)) {
        const duplicateEntries = report.filter(
          (entry) => entry[field] === removedValue
        )

        const reducedEntry = duplicateEntries.reduce(
          (reducedEntry, newEntry) => ({
            author: duplicateEntries[0].author,
            email: duplicateEntries[0].email,
            commits: reducedEntry.commits + newEntry.commits,
            'added lines':
              reducedEntry['added lines'] + newEntry['added lines'],
            'excluded lines':
              reducedEntry['excluded lines'] + newEntry['excluded lines'],
            'total lines':
              reducedEntry['total lines'] + newEntry['total lines'],
          })
        )

        const filteredReport = newReport.filter(
          (entry) => entry[field] !== removedValue
        )
        filteredReport.push(reducedEntry)

        newReport = filteredReport
      }
    }

    return newReport
  }
}

export function sortNumericValues(
  firstValue: number,
  secondValue: number,
  order: Order
): number {
  const diff = firstValue - secondValue

  if (order === 'ASC') {
    return diff
  }

  return -diff
}

export function sortStringValues(
  firstValue: string,
  secondValue: string,
  order: Order
): number {
  if (firstValue === secondValue) {
    return 0
  }

  if (order === 'ASC') {
    return firstValue > secondValue ? 1 : -1
  }

  return firstValue > secondValue ? -1 : 1
}
