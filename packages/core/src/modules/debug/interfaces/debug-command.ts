export enum DebugCommand {
  GenerateGold = "debug/generate-gold",
}

export interface GenerateGoldArgs {
  gold: number;
}

declare module "../../../core/command/command-type" {
  interface CommandType {
    [DebugCommand.GenerateGold]: GenerateGoldArgs;
  }
}
