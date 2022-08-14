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

### Customize your report

You can customize your git reports including the following flags to the `git-reports` command:

- `--include-merges`: Include the merge commits in the report data, which are ignored by default.
- `--debug`: Include additional debug logs in the terminal output to help you find errors/bugs.
- `--order-by`: Sort the report by the specified field. Value must be a report field ("author", "email", "commits", "added lines", "excluded lines" or "total lines"). Default value: "commits".
- `--order`: Sort the report by either ascending order or descending order. Possible values: "ASC" or "DESC". Default value: "DESC".
