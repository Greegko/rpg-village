import { Module } from "../../models";
import { CommandHandler } from "./command-handler";
import { CommandStore } from "./command-store";

export const commandModule: Module = {
  stores: [{ scope: 'commands', store: CommandStore }],
  provides: [CommandHandler]
};
