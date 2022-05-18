import { promisify } from "util";
import { parseArgs } from "./args";

const exec = promisify(require("child_process").exec);

async function processCommits(authors, commits, includeMerges) {
  const commitsReport = await exec(
    `git shortlog -s -n --all ${includeMerges ? "" : "--no-merges"}`
  );
  const commitsReportArr = commitsReport.stdout
    .trim()
    .replace("'", "")
    .split(/\s+/);

  commitsReportArr.forEach((str) => {
    if (/^\d+$/.test(str)) {
      commits.push(str);
    } else {
      if (commits.length > authors.length) {
        authors.push(str);
      } else {
        authors[authors.length - 1] = authors[authors.length - 1] + " " + str;
      }
    }
  });
}

async function processLines(author, awk) {
  const linesReport = await exec(
    `git log --author="${author}" --pretty=tformat: --numstat | ${
      awk ? "awk" : "gawk"
    } '{ added += $1; excluded += $2; total += $1 + $2 } END { printf "%s %s %s", added, excluded, total }' -`
  );
  const linesArr = [];

  const linesReportArr = linesReport.stdout.trim().split(/\s+/);
  linesReportArr.forEach((str) => {
    if (/^\d+$/.test(str)) {
      linesArr.push(str);
    }
  });

  return linesArr;
}

export async function cli(args) {
  const options = parseArgs(args);
  const authors = [];
  const commits = [];
  const addedLines = [];
  const excludedLines = [];
  const totalLines = [];

  await processCommits(authors, commits);

  for (const author of authors) {
    const linesArr = await processLines(author, options.awk);
    addedLines.push(linesArr[0]);
    excludedLines.push(linesArr[1]);
    totalLines.push(linesArr[2]);
  }

  const table = [];

  for (let i = 0; i < authors.length; i++) {
    const entry = {
      author: authors[i],
      commits: commits[i],
      "added lines": addedLines[i],
      "excluded lines": excludedLines[i],
      "total lines": totalLines[i],
    };

    table.push(entry);
  }

  console.table(table);
}
