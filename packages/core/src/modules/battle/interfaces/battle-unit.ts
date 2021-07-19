import { UnitID } from "@modules/unit";
import { BattleStats } from './battle-stats';

export interface BattleUnit {
  unitId: UnitID;
  battleStats: BattleStats;
}
