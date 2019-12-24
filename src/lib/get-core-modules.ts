import { Module } from '../models';
import { activityModule } from '../modules/activity';
import { commandModule } from '../modules/command';
import { unitModule } from '../modules/unit';
import { heroModule } from '../modules/hero';
import { partyModule } from '../modules/party';
import { stashModule } from '../modules/stash';

export const getCoreModules: () => Module[] = () => {
  return [activityModule, commandModule, unitModule, heroModule, partyModule, stashModule];
};
