import { GitReport, GitReportData, GitReportEntry } from "./types";

export class ReportFormatter {
  public report: GitReport = [];

  private getGitReportEntriesByEmail(email: string) {
    return this.report.filter((entry) => entry.email === email);
  }

  private joinUsersWithSameEmail(emails: string[]) {
    const emailsCopy = [...emails];

    while (emailsCopy.length) {
      const removedEmail = emailsCopy.shift();

      if (emailsCopy.includes(removedEmail)) {
        const sameEmailEntries = this.getGitReportEntriesByEmail(removedEmail);
        const reducedEntry = sameEmailEntries.reduce(
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
          { ...sameEmailEntries[0] }
        );

        const filteredReport = this.report.filter(
          (entry) => entry.email !== removedEmail
        );
        filteredReport.push(reducedEntry);

        this.report = filteredReport;
      }
    }
  }

  generateReport({
    authors,
    emails,
    commits,
    addedLines,
    excludedLines,
  }: GitReportData): GitReport {
    for (let i = 0; i < authors.length; i++) {
      const entry: GitReportEntry = {
        author: authors[i],
        email: emails[i],
        commits: commits[i],
        "added lines": addedLines[i],
        "excluded lines": excludedLines[i],
        "total lines": Number(addedLines[i]) + Number(excludedLines[i]),
      };

      this.report.push(entry);
    }

    this.joinUsersWithSameEmail(emails);

    return this.report.sort((a, b) => a.commits - b.commits);
  }
}
