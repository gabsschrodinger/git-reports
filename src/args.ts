import arg from "arg";
import { Options } from "./types";

const config = {
  // os
  "--macos": Boolean,
  "--windows": Boolean,
  "--linux": "--macos",
  "--include-merges": Boolean,

  // os aliases
  "-m": "--macos",
  "--mac": "--macos",
  "-w": "--windows",
  "--win": "--windows",
  "-l": "--macos",
};

export function parseArgs(rawArgs: string[]): Options {
  const args = arg(config, {
    argv: rawArgs.slice(2),
  });

  return {
    useAwk: args["--macos"] || false,
    includeMerges: args["--include-merges"] || false,
  };
}
