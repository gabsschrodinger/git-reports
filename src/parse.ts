import { promisify } from "util";
import { GitReportOptions } from "./types";

export const exec = promisify(require("child_process").exec);

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
  { debugMode }: GitReportOptions
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
