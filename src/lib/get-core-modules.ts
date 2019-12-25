import { Module } from '../models';
import { activityModule } from '../modules/activity';
import { commandModule } from '../modules/command';
import { unitModule } from '../modules/unit';

export const getCoreModules: () => Module[] = () => {
  return [activityModule, commandModule, unitModule];
};
