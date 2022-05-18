import arg from "arg";

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

export function parseArgs(rawArgs) {
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
    awk: args["--macos"] || false,
    merges: args["--include-merges"] || false,
  };
}
