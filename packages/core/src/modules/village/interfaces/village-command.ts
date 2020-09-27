import { Command } from "../../../models";
import { PartyID } from "../../party";

export enum VillageCommand {
  BuildHouse = 'village/build-house',
  BuildBlacksmith = 'village/build-blacksmith',
  GenerateGold = 'village/generate-gold',
  HireHero = 'village/hire-unit',
  HealParty = 'village/heal',
};

export interface GenerateGoldCommand extends Command { command: VillageCommand.GenerateGold };
export interface BuildHouseCommand extends Command { command: VillageCommand.BuildHouse };
export interface BuildBlacksmithCommand extends Command { command: VillageCommand.BuildBlacksmith };
export interface HireUnitCommand extends Command { command: VillageCommand.HireHero };
export interface HealPartyCommand extends Command { command: VillageCommand.HealParty, args: { partyId: PartyID } };