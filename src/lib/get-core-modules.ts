import { Module } from '../models';
import { activityModule } from '../modules/activity';
import { commandModule } from '../modules/command';
import { unitModule } from '../../core-src';
import { heroModule } from '../../core-src';
import { partyModule } from '../../core-src';
import { stashModule } from '../../core-src';

export const getCoreModules: () => Module[] = () => {
  return [activityModule, commandModule, unitModule, heroModule, partyModule, stashModule];
};
