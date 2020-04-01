import { CommandSystem } from "../lib/command-system";

export interface CommandHandler {
  init(e: CommandSystem);
}
