import { promisify } from "util";
import { exec } from "child_process";

export const execTerminalCommand = promisify(exec);
