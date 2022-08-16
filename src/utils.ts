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

        const filteredReport = report.filter(
          (entry) => entry[field] !== removedValue
        )
        filteredReport.push(reducedEntry)

        newReport = filteredReport
      }
    }

    return newReport
  }
}

export function sortNumbericValues(
  firstValue: number,
  secondValue: number,
  order: Order
) {
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

  const firstIsGreater = firstValue > secondValue

  if (order === 'ASC') {
    return +firstIsGreater
  }

  return -firstIsGreater
}
