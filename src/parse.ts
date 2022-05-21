import { promisify } from "util";

const exec = promisify(require("child_process").exec);

export async function processCommits(
  authors: string[],
  commits: number[],
  includeMerges: boolean
): Promise<void> {
  const commitsReport = await exec(
    `git shortlog -s -n --all ${includeMerges ? "" : "--no-merges"}`
  );
  const commitsReportArr = commitsReport.stdout
    .trim()
    .replace("'", "")
    .split(/\s+/);

  commitsReportArr.forEach((str: string) => {
    if (/^\d+$/.test(str)) {
      commits.push(Number(str));
    } else {
      if (commits.length > authors.length) {
        authors.push(str);
      } else {
        authors[authors.length - 1] = authors[authors.length - 1] + " " + str;
      }
    }
  });
}

export async function processLines(
  authors: string[],
  addedLines: number[],
  excludedLines: number[],
  awk: boolean
) {
  for (const author of authors) {
    const linesReport = await exec(
      `git log --author="${author}" --pretty=tformat: --numstat | ${
        awk ? "awk" : "gawk"
      } '{ added += $1; excluded += $2 } END { printf "%s %s", added, excluded }' -`
    );
    const linesArr = [];

    const linesReportArr = linesReport.stdout.trim().split(/\s+/);
    linesReportArr.forEach((str: string) => {
      if (/^\d+$/.test(str)) {
        linesArr.push(str);
      }
    });

    addedLines.push(Number(linesArr[0]));
    excludedLines.push(Number(linesArr[1]));
  }
}
