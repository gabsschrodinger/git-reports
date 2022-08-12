import { promisify } from "util";

const exec = promisify(require("child_process").exec);

export async function processCommits(
  authors: string[],
  commits: number[],
  includeMerges: boolean
): Promise<void> {
  const commitsReport = await exec(
    `git shortlog -s -n --all${includeMerges ? "" : " --no-merges"}`
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

function getAddedLinesFromUser(shortstatLog: string) {
  const addedLinesRegex = /\d+(?=\s+insertion)/g;

  return shortstatLog
    .match(addedLinesRegex)
    .map((addedLines) => Number(addedLines))
    .reduce((sum, addedLines) => sum + addedLines, 0);
}

function getDeletedLinesFromUser(shortstatLog: string) {
  const deletedLinesRegex = /\d+(?=\s+deletion)/g;

  return shortstatLog
    .match(deletedLinesRegex)
    .map((deletedLines) => Number(deletedLines))
    .reduce((sum, deletedLines) => sum + deletedLines, 0);
}

export async function processLines(
  authors: string[],
  addedLines: number[],
  excludedLines: number[]
) {
  for (const author of authors) {
    const { stdout: shortstatLog } = await exec(
      `git log --author="${author}" --pretty=tformat: --shortstat`
    );

    addedLines.push(getAddedLinesFromUser(shortstatLog));
    excludedLines.push(getDeletedLinesFromUser(shortstatLog));
  }
}
