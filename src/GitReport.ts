import { exec } from "./parse";
import { GitReportOptions } from "./types";

export class GitReport {
  public authors: string[] = [];
  public emails: string[] = [];
  public commits: number[] = [];
  public addedLines: number[] = [];
  public excludedLines: number[] = [];
  public options: GitReportOptions;

  constructor(options: GitReportOptions) {
    this.options = options;
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
}
