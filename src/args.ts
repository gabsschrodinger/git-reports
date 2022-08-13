import arg from "arg";
import { GitReportEntry, GitReportOptions, isGitReportEntryKey, isOrder, Order } from "./types";

const config = {
  "--include-merges": Boolean,
  "--include-email": Boolean,
  "--debug": Boolean,
  "--order-by": String,
  "--order": String,
};

function getOrderByValue(args: ReturnType<typeof arg<typeof config>>): keyof GitReportEntry {
  const orderBy = args["--order-by"]

  if (!orderBy) {
    return "commits"
  }

  if (isGitReportEntryKey(orderBy)) {
    return orderBy
  }

  console.error("Invalid value for [--order-by] flag, git-reports is going its default value ('commits')")

  return "commits"
}

function getOrderValue(args: ReturnType<typeof arg<typeof config>>): Order {
  const order = args["--order"]

  if (!order) {
    return Order.DESC
  }

  if (isOrder(order)) {
    return order
  }

  console.error("Invalid value for [--order] flag, git-reports is going its default value ('DESC')")

  return Order.DESC
}

export function parseArgs(rawArgs: string[]): GitReportOptions {
  const args = arg(config, {
    argv: rawArgs.slice(2),
  });


  return {
    includeMerges: args["--include-merges"] || false,
    includeEmail: args["--include-email"] || false,
    debugMode: args["--debug"] || false,
    orderBy: getOrderByValue(args),
    order: getOrderValue(args),
  };
}
