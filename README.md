<div align="center">
  <h1>git-reports</h1>
</div>

Generate reports about authors, commits and lines modified.

## Getting started

Install the `git-reports` cli with:

```
npm i -g git-reports
```

or

```
yarn global add git-reports
```

To generate a report, use the terminal to go to a folder where you have a git project, then run the command `git-reports`:

```
git-reports
```

Example of output:

![output_example](https://raw.githubusercontent.com/gabsschrodinger/git-reports/main/assets/report-example.png)

You can also customize the report including merge commits, which are ignored by default. To do it, use the flag `--include-merges`.
