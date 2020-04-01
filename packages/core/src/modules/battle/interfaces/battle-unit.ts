import { UnitID } from "../../unit/interfaces";
import { BattleStats } from './battle-stats';

export interface BattleUnit {
  unitId: UnitID;
  battleStats: BattleStats;
}
