import {
  GitReport,
  GitReportData,
  GitReportEntry,
  GitReportOptions,
} from "./types";

export class ReportFormatter {
  public report: GitReport = [];
  private options: GitReportOptions;

  constructor(options: GitReportOptions) {
    this.options = options;
  }

  private getGitReportEntriesByEmail(email: string) {
    return this.report.filter((entry) => entry.email === email);
  }

  private groupUsersByEmail(emails: string[]) {
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

  private groupUsersByName() {
    const namesCopy = [...this.report.map((entry) => entry.author)];

    while (namesCopy.length) {
      const removedName = namesCopy.shift();

      if (namesCopy.includes(removedName)) {
        const sameNameEntries = this.report.filter(
          (entry) => entry.author === removedName
        );
        const reducedEntry = sameNameEntries.reduce(
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
          { ...sameNameEntries[0] }
        );

        const filteredReport = this.report.filter(
          (entry) => entry.author !== removedName
        );
        filteredReport.push(reducedEntry);

        this.report = filteredReport;
      }
    }
  }

  private removeEmailsFromReport() {
    this.report.forEach((entry) => {
      delete entry.email;
    });
  }

  private sortReport() {
    this.report = this.report.sort((a, b) => {
      const firstValue = a[this.options.orderBy];
      const secondValue = b[this.options.orderBy];
      if (typeof firstValue === "number" && typeof secondValue === "number") {
        if (this.options.order === "ASC") {
          return firstValue - secondValue;
        } else {
          return secondValue - firstValue;
        }
      } else if (
        typeof firstValue === "string" &&
        typeof secondValue === "string"
      ) {
        if (this.options.order === "ASC") {
          if (firstValue < secondValue) {
            return -1;
          } else if (firstValue > secondValue) {
            return 1;
          }

          return 0;
        }
      }
    });
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

    this.sortReport();
    this.groupUsersByEmail(emails);

    if (this.options.groupByName) {
      this.groupUsersByName();
    }

    if (!this.options.includeEmail) {
      this.removeEmailsFromReport();
    }

    return this.report;
  }
}
