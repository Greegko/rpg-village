import { Module } from '@greegko/rpg-model';
import { activityModule } from '@greegko/rpg-model';
import { commandModule } from '@greegko/rpg-model';
import { unitModule } from '@greegko/rpg-model';
import { heroModule } from '@greegko/rpg-model';
import { partyModule } from '@greegko/rpg-model';
import { stashModule } from '@greegko/rpg-model';

export const getCoreModules: () => Module[] = () => {
  return [activityModule, commandModule, unitModule, heroModule, partyModule, stashModule];
};
