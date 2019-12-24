import { UnitID } from "../../../../core-src";
import { BattleStats } from './battle-stats';

export interface BattleUnit {
  unitId: UnitID;
  battleStats: BattleStats;
}
