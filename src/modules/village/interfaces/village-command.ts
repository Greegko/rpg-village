import { Command } from "../../../models";

export enum VillageCommand {
  BuildHouse = 'village/build-house',
  GenerateGold = 'village/generate-gold',
  HireHero = 'village/hire-unit'
};

export interface GenerateGoldCommand extends Command { command: VillageCommand.GenerateGold };
export interface BuildHouseCommand extends Command { command: VillageCommand.BuildHouse };
export interface HireUnitCommand extends Command { command: VillageCommand.HireHero };
