import { UnitID } from "../../unit/interfaces";
import { Effect } from '../../../models';

export interface BattleParty {
  unitIds: UnitID[];
  effects: Effect[];
}
