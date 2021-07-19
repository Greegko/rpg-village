import { UnitID } from "@modules/unit";
import { Effect } from '@models/effect';

export interface BattleParty {
  unitIds: UnitID[];
  effects: Effect[];
}
