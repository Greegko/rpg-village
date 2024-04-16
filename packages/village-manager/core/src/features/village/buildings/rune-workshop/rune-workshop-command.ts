import { ItemID } from "@features/item";

import { VillageID } from "../../interfaces";

export enum RuneWorkshopCommand {
  CreateRune = "rune-workshop/create-rune",
  EmpowerRune = "rune-workshop/empower-rune",
  DismantleRune = "rune-workshop/dissamble-rune",
  ForgeDungeonKey = "rune-workshop/forge-dungeon-key",
}

export interface ForgeDungeonKeyCommandArgs {
  villageId: VillageID;
}

export interface CreateRuneCommandArgs {
  villageId: VillageID;
}

export interface EmpowerRuneCommandArgs {
  villageId: VillageID;
  runeId: ItemID;
  soul: number;
}

export interface DismantleRuneCommandArgs {
  villageId: VillageID;
  runeId: ItemID;
}
