import { promisify } from "util";
import { Options } from "./types";

const exec = promisify(require("child_process").exec);

export async function processCommits(
  authors: string[],
  emails: string[],
  commits: number[],
  { includeMerges, debugMode }: Options
): Promise<void> {
  const { stdout: commitsReport } = await exec(
    `git shortlog -s -n -e --all${includeMerges ? "" : " --no-merges"}`
  );

  if (debugMode) {
    console.log(">>> DEBUG:", commitsReport);
  }

  const commitsReportArr = commitsReport.trim().replace("'", "").split(/\s+/);

  commitsReportArr.forEach((str: string) => {
    if (/^\d+$/.test(str)) {
      commits.push(Number(str));
    } else {
      if (/\S+@\S+\.\S+/.test(str)) {
        emails.push(str);
      } else if (commits.length > authors.length) {
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
  excludedLines: number[],
  { debugMode }: Options
) {
  for (const author of authors) {
    const { stdout: shortstatLog } = await exec(
      `git log --author="${author}" --pretty=tformat: --shortstat`
    );

    if (debugMode) {
      console.log(">>> DEBUG:", shortstatLog);
    }

    addedLines.push(getAddedLinesFromUser(shortstatLog));
    excludedLines.push(getDeletedLinesFromUser(shortstatLog));
  }
}
