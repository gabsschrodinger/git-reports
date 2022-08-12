import { GitReport, GitReportData, GitReportEntry } from "./types";

function getGitReportEntriesByEmail(report: GitReport, email: string) {
  return report.filter((entry) => entry.email === email);
}

function joinUsersWithSameEmail(report: GitReport, emails: string[]) {
  const emailsCopy = [...emails];

  while (emailsCopy.length) {
    const removedEmail = emailsCopy.shift();

    if (emailsCopy.includes(removedEmail)) {
      const sameEmailEntries = getGitReportEntriesByEmail(report, removedEmail);
      const reducedEntry = sameEmailEntries.reduce(
        (reducedEntry, newEntry) => ({
          author: reducedEntry.author,
          email: reducedEntry.email,
          commits: reducedEntry.commits + newEntry.commits,
          "added lines": reducedEntry["added lines"] + newEntry["added lines"],
          "excluded lines":
            reducedEntry["excluded lines"] + newEntry["excluded lines"],
          "total lines": reducedEntry["total lines"] + newEntry["total lines"],
        }),
        { ...sameEmailEntries[0] }
      );
    }
  }
}

export const generateReport = (options: GitReportData): GitReport => {
  const { authors, emails, commits, addedLines, excludedLines } = options;
  const table: GitReport = [];

  for (let i = 0; i < authors.length; i++) {
    const entry: GitReportEntry = {
      author: authors[i],
      email: emails[i],
      commits: commits[i],
      "added lines": addedLines[i],
      "excluded lines": excludedLines[i],
      "total lines": Number(addedLines[i]) + Number(excludedLines[i]),
    };

    table.push(entry);
  }

  joinUsersWithSameEmail(table, emails);

  return table.sort((a, b) => a.commits - b.commits);
};
