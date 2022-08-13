import { GitReportEntry, Order } from "./types";

export function groupUsersBy(field: keyof GitReportEntry) {
  return function (report: GitReportEntry[]) {
    let newReport = [...report];
    const fieldCollectionCopy = [...report.map((entry) => entry[field])];

    while (fieldCollectionCopy.length) {
      const removedValue = fieldCollectionCopy.shift();

      if (fieldCollectionCopy.includes(removedValue!)) {
        const duplicateEntries = report.filter(
          (entry) => entry[field] === removedValue
        );

        const reducedEntry = duplicateEntries.reduce(
          (reducedEntry, newEntry) => ({
            author: reducedEntry.author,
            email: reducedEntry.email,
            commits: reducedEntry.commits + newEntry.commits,
            "added lines":
              reducedEntry["added lines"] + newEntry["added lines"],
            "excluded lines":
              reducedEntry["excluded lines"] + newEntry["excluded lines"],
            "total lines":
              reducedEntry["total lines"] + newEntry["total lines"],
          }),
          { ...duplicateEntries[0] }
        );

        const filteredReport = report.filter(
          (entry) => entry[field] !== removedValue
        );
        filteredReport.push(reducedEntry);

        newReport = filteredReport;
      }
    }

    return newReport;
  };
}

const sortAscNumber = (firstValue: number, secondValue: number): number => {
  return firstValue - secondValue;
};

const sortDescNumber = (firstValue: number, secondValue: number): number => {
  return secondValue - firstValue;
};

const sortAscString = (firstValue: string, secondValue: string): number => {
  if (firstValue < secondValue) {
    return -1;
  }

  if (firstValue > secondValue) {
    return 1;
  }

  return 0;
};

const sortDescString = (firstValue: string, secondValue: string): number => {
  if (firstValue < secondValue) {
    return 1;
  }

  if (firstValue > secondValue) {
    return -1;
  }

  return 0;
};

export function sortReportBy(field: keyof GitReportEntry, order: Order) {
  return function (report: GitReportEntry[]) {
    return report.sort((a, b) => {
      const firstValue = a[field];
      const secondValue = b[field];
      if (typeof firstValue === "number" && typeof secondValue === "number") {
        if (order === "ASC") {
          return sortAscNumber(firstValue, secondValue);
        } else {
          return sortDescNumber(firstValue, secondValue);
        }
      } else if (
        typeof firstValue === "string" &&
        typeof secondValue === "string"
      ) {
        if (order === "ASC") {
          return sortAscString(firstValue, secondValue);
        } else {
          return sortDescString(firstValue, secondValue);
        }
      }

      return 0;
    });
  };
}
