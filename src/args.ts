import arg from "arg";
import { Options } from "./types";

const os = {
  "--macos": Boolean,
  "--windows": Boolean,
  "--linux": "--macos",

  // aliases
  "-m": "--macos",
  "--mac": "--macos",
  "-w": "--windows",
  "--win": "--windows",
  "-l": "--macos",
};

const config = {
  "--include-merges": Boolean,
};

export function parseArgs(rawArgs: string[]): Options {
  const args = arg(
    {
      ...os,
      ...config,
    },
    {
      argv: rawArgs.slice(2),
    }
  );

  return {
    useAwk: args["--macos"] || false,
    includeMerges: args["--include-merges"] || false,
  };
}
