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

To generate a report, use the terminal to go to a folder where you have a git project, then run the command `git-reports` followed by the flag of your OS:

```
git-reports --windows
```

Example of output:

![output_example](https://raw.githubusercontent.com/gabsschrodinger/git-reports/main/assets/report-example.png)

The OS flags are:

- `--windows` (or `-w`, `--win`)
- `--macos` (or `-m`, `--mac`)
- `--linux` (or `-l`)

The default value for the OS flag is `windows`.

You can also customize the report including merge commits, which are ignored by default. To do it, use the flag `--include-merges`.
