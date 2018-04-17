import { UnitID } from '@greegko/rpg-model';
import { BattleStats } from './battle-stats';

export interface BattleUnit {
  unitId: UnitID;
  battleStats: BattleStats;
}
