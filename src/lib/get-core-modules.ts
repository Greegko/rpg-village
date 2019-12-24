import { Module } from '@greegko/rpg-model';
import { activityModule } from '../modules/activity';
import { commandModule } from '../modules/command';
import { unitModule } from '@greegko/rpg-model';
import { heroModule } from '@greegko/rpg-model';
import { partyModule } from '@greegko/rpg-model';
import { stashModule } from '@greegko/rpg-model';

export const getCoreModules: () => Module[] = () => {
  return [activityModule, commandModule, unitModule, heroModule, partyModule, stashModule];
};
