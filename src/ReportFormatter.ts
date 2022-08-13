import {
  GitReport,
  GitReportData,
  GitReportEntry,
  GitReportOptions,
} from "./types";
import { groupUsersBy } from "./utils";

export class ReportFormatter {
  private report: GitReport = [];
  private readonly options: GitReportOptions;

  constructor(options: GitReportOptions) {
    this.options = options;
  }

  private groupUsersByEmail() {
    this.report = groupUsersBy("email")(this.report);
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

    this.groupUsersByEmail();

    this.sortReport();

    if (!this.options.includeEmail) {
      this.removeEmailsFromReport();
    }

    return this.report;
  }
}
