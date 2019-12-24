import { Module } from '../../models';
import { BattleService } from "./battle-service";
import { BattleStore } from "./battle-store";
import { BattleActivity } from "./activities";

export const battleModule: Module = {
  activities: [{ type: 'battle', activity: BattleActivity }],
  stores: [{ scope: 'battle', store: BattleStore }],
  provides: [BattleService]
};
