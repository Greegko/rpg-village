import { ItemID } from "@models";

export enum RuneWorkshopCommand {
  CreateRune = "rune-workshop/create-rune",
  EmpowerRune = "rune-workshop/empower-rune",
  DismantleRune = "rune-workshop/dissamble-rune",
  ForgeDungeonKey = "rune-workshop/forge-dungeon-key",
}

export interface EmpowerRuneCommandArgs {
  runeId: ItemID;
  soul: number;
}

export interface DismantleRuneCommandArgs {
  runeId: ItemID;
}
