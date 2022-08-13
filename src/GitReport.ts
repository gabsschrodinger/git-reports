import { exec } from "./utils";
import { GitReportOptions } from "./types";
import { ReportFormatter } from "./ReportFormatter";

export class GitReport {
  public authors: string[] = [];
  public emails: string[] = [];
  public commits: number[] = [];
  public addedLines: number[] = [];
  public excludedLines: number[] = [];
  public options: GitReportOptions;
  private reportFormatter: ReportFormatter;

  constructor(options: GitReportOptions) {
    this.options = options;
    this.reportFormatter = new ReportFormatter(options);
  }

  async processCommits(): Promise<void> {
    const { stdout: commitsReport } = await exec(
      `git shortlog -s -n -e --all${
        this.options.includeMerges ? "" : " --no-merges"
      }`
    );

    if (this.options.debugMode) {
      console.log(">>> DEBUG:", commitsReport);
    }

    const commitsReportArr = commitsReport.trim().replace("'", "").split(/\s+/);

    commitsReportArr.forEach((str: string) => {
      if (/^\d+$/.test(str)) {
        this.commits.push(Number(str));
      } else {
        if (/\S+@\S+\.\S+/.test(str)) {
          this.emails.push(str);
        } else if (this.commits.length > this.authors.length) {
          this.authors.push(str);
        } else {
          this.authors[this.authors.length - 1] =
            this.authors[this.authors.length - 1] + " " + str;
        }
      }
    });
  }

  private getAddedLinesFromUser(shortstatLog: string) {
    try {
      const addedLinesRegex = /\d+(?=\s+insertion)/g;

      return shortstatLog
        .match(addedLinesRegex)
        .map((addedLines) => Number(addedLines))
        .reduce((sum, addedLines) => sum + addedLines, 0);
    } catch (error) {
      if (this.options.debugMode) {
        console.log(">>> DEBUG:", { error });
      }

      return 0;
    }
  }

  private getDeletedLinesFromUser(shortstatLog: string) {
    try {
      const deletedLinesRegex = /\d+(?=\s+deletion)/g;

      return shortstatLog
        .match(deletedLinesRegex)
        .map((deletedLines) => Number(deletedLines))
        .reduce((sum, deletedLines) => sum + deletedLines, 0);
    } catch (error) {
      if (this.options.debugMode) {
        console.log(">>> DEBUG:", { error });
      }

      return 0;
    }
  }

  async processLines() {
    for (const author of this.authors) {
      const { stdout: shortstatLog } = await exec(
        `git log --author="${author}" --pretty=tformat: --shortstat`
      );

      if (this.options.debugMode) {
        console.log(">>> DEBUG:", shortstatLog);
      }

      this.addedLines.push(this.getAddedLinesFromUser(shortstatLog));
      this.excludedLines.push(this.getDeletedLinesFromUser(shortstatLog));
    }
  }

  getReport() {
    return this.reportFormatter.generateReport(this);
  }
}
