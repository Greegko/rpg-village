import { CommandType } from "@rpg-village/core/extend";

type CommandBase<T extends keyof CommandType> = T extends string
  ? CommandType[T] extends undefined
    ? { command: T }
    : { command: T; args: CommandType[T] }
  : never;

export type Command = CommandBase<keyof CommandType>;
