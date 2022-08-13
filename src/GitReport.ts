import { execTerminalCommand } from "./terminal";
import { GitReportOptions } from "./types";
import { ReportFormatter } from "./ReportFormatter";
import { groupUsersBy } from "./utils";

export class GitReport {
  public authors: string[] = [];
  public emails: string[] = [];
  public commits: number[] = [];
  public addedLines: number[] = [];
  public excludedLines: number[] = [];
  private readonly options: GitReportOptions;
  private readonly reportFormatter: ReportFormatter;

  constructor(options: GitReportOptions) {
    this.options = options;
    this.reportFormatter = new ReportFormatter(options);
  }

  async processCommits(): Promise<void> {
    const { stdout: commitsReport } = await execTerminalCommand(
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

    const groupedEntries = groupUsersBy("author")(
      this.authors.map((author, index) => ({
        author,
        email: this.emails[index],
        commits: this.commits[index],
        "added lines": 0,
        "excluded lines": 0,
        "total lines": 0,
      }))
    );

    this.authors = groupedEntries.map((entry) => entry.author);
    this.emails = groupedEntries.map((entry) => entry.email);
    this.commits = groupedEntries.map((entry) => entry.commits);
  }

  private getAddedLinesFromUser(shortstatLog: string) {
    try {
      const addedLinesRegex = /\d+(?=\s+insertion)/g;

      const addedLinesCollection = shortstatLog.match(addedLinesRegex);

      if (!addedLinesCollection) {
        return 0;
      }

      return addedLinesCollection
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

      const deletedLinesCollection = shortstatLog.match(deletedLinesRegex);

      if (!deletedLinesCollection) {
        return 0;
      }

      return deletedLinesCollection
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
      const { stdout: shortstatLog } = await execTerminalCommand(
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
