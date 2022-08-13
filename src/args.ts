import arg from "arg";
import { GitReportOptions } from "./types";

const config = {
  "--include-merges": Boolean,
  "--include-email": Boolean,
  "--debug": Boolean,
};

export function parseArgs(rawArgs: string[]): GitReportOptions {
  const args = arg(config, {
    argv: rawArgs.slice(2),
  });

  return {
    includeMerges: args["--include-merges"] || false,
    includeEmail: args["--include-email"] || false,
    debugMode: args["--debug"] || false,
  };
}
