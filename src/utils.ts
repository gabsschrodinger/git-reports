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
            author: reducedEntry.author,
            email: reducedEntry.email,
            commits: reducedEntry.commits + newEntry.commits,
            'added lines':
              reducedEntry['added lines'] + newEntry['added lines'],
            'excluded lines':
              reducedEntry['excluded lines'] + newEntry['excluded lines'],
            'total lines':
              reducedEntry['total lines'] + newEntry['total lines'],
          }),
          { ...duplicateEntries[0] }
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

function sortNumbericValue(
  firstValue: number,
  secondValue: number,
  order: Order
) {
  const diff = firstValue - secondValue

  if (order === Order.ASC) {
    return diff
  }

  return -diff
}

function sortStringValue(
  firstValue: string,
  secondValue: string,
  order: Order
): number {
  if (firstValue === secondValue) {
    return 0
  }

  const firstIsGreater = firstValue > secondValue

  if (order === Order.ASC) {
    return +firstIsGreater
  }

  return -firstIsGreater
}

function isType<T>(type: string) {
  return (value: any): value is T => typeof value === type
}

const isString = isType<string>('string')
const isNumber = isType<number>('number')

export function sortReportBy(field: keyof GitReportEntry, order: Order) {
  return function (report: GitReportEntry[]) {
    return report.sort((a, b) => {
      const firstValue = a[field]
      const secondValue = b[field]

      if (isNumber(firstValue) && isNumber(secondValue)) {
        return sortNumbericValue(firstValue, secondValue, order)
      } else if (isString(firstValue) && isString(secondValue)) {
        return sortStringValue(firstValue, secondValue, order)
      }

      return 0
    })
  }
}
