import { Entity } from '@greegko/rpg-model';
import { BattleParty } from './battle-party';

export interface BattleState {
  party: BattleParty;
  enemyParty: BattleParty;
  units: { [key: string]: Entity };
}