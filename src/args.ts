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

function getArgValue<T>(
  argKey: keyof typeof config,
  args: ReturnType<typeof arg<typeof config>>,
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

function getOrderByValue(
  args: ReturnType<typeof arg<typeof config>>
): keyof GitReportEntry {
  return getArgValue('--order-by', args, 'commits', isGitReportEntryKey)
}

function getOrderValue(args: ReturnType<typeof arg<typeof config>>): Order {
  return getArgValue('--order', args, Order.DESC, isOrder)
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
