import { CommandSystem } from "@core/command";

export interface CommandHandler {
  init(e: CommandSystem): void;
}
