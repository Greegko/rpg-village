import { Module } from '../models';
import { activityModule } from '../modules/activity';
import { unitModule } from '../modules/unit';

export const getCoreModules: () => Module[] = () => {
  return [activityModule, unitModule];
};
