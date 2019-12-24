import { UnitID } from "../../../../core-src";
import { Effect } from '../../../models';

export interface BattleParty {
  unitIds: UnitID[];
  effects: Effect[];
}
