import { GitReportEntry } from "./types";

export function groupUsersBy(field: keyof GitReportEntry) {
  return function (report: GitReportEntry[]) {
    let newReport = [...report];
    const fieldCollectionCopy = [...report.map((entry) => entry[field])];

    while (fieldCollectionCopy.length) {
      const removedValue = fieldCollectionCopy.shift();

      if (fieldCollectionCopy.includes(removedValue)) {
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
