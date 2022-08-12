import arg from "arg";
import { Options } from "./types";

const config = {
  "--include-merges": Boolean,
  "--debug": Boolean,
};

export function parseArgs(rawArgs: string[]): Options {
  const args = arg(config, {
    argv: rawArgs.slice(2),
  });

  return {
    includeMerges: args["--include-merges"] || false,
    debugMode: args["--debug"] || false,
  };
}
