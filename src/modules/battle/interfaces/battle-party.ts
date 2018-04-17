import { Effect, UnitID } from '@greegko/rpg-model';

export interface BattleParty {
  unitIds: UnitID[];
  effects: Effect[];
}
