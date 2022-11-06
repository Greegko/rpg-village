import { ItemID } from "@models/item";

export enum RuneWorkshopCommand {
  CreateRune = "rune-workshop/create-rune",
  EmpowerRune = "rune-workshop/empower-rune",
  ForgeDungeonKey = "rune-workshop/forge-dungeon-key",
}

export interface EmpowerRuneCommandArgs {
  runeId: ItemID;
  soul: number;
}

declare module "@core/global-type/command-type" {
  interface CommandType {
    [RuneWorkshopCommand.CreateRune]: undefined;
    [RuneWorkshopCommand.ForgeDungeonKey]: undefined;
    [RuneWorkshopCommand.EmpowerRune]: EmpowerRuneCommandArgs;
  }
}
