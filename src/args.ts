import arg from 'arg'
import {
  GitReportEntry,
  GitReportOptions,
  isGitReportEntryKey,
  isOrder,
  Order,
} from './types'

const config = {
  '--include-merges': Boolean,
  '--include-email': Boolean,
  '--debug': Boolean,
  '--order-by': String,
  '--order': String,
}

type Args = ReturnType<typeof arg<typeof config>>

function getArgValue<T>(
  argKey: keyof typeof config,
  args: Args,
  defaultValue: T,
  validateType: (value: any) => value is T
): T {
  const argValue = args[argKey]

  if (!argValue) {
    return defaultValue
  }

  if (validateType(argValue)) {
    return argValue
  }

  console.error(
    `Invalid value for [${argKey}] flag, git-reports is going its default value ('${defaultValue}')`
  )

  return defaultValue
}

function getOrderByValue(args: Args): keyof GitReportEntry {
  return getArgValue('--order-by', args, 'commits', isGitReportEntryKey)
}

function getOrderValue(args: Args): Order {
  return getArgValue('--order', args, "DESC", isOrder)
}

export function parseArgs(rawArgs: string[]): GitReportOptions {
  const args = arg(config, {
    argv: rawArgs.slice(2),
  })

  return {
    includeMerges: args['--include-merges'] || false,
    includeEmail: args['--include-email'] || false,
    debugMode: args['--debug'] || false,
    orderBy: getOrderByValue(args),
    order: getOrderValue(args),
  }
}
