import { UnitID } from '@greegko/rpg-model';
import { Effect } from '../../../models';

export interface BattleParty {
  unitIds: UnitID[];
  effects: Effect[];
}
