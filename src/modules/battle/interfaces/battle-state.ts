import { Entity } from '../../../models';
import { BattleParty } from './battle-party';

export interface BattleState {
  party: BattleParty;
  enemyParty: BattleParty;
  units: { [key: string]: Entity };
}