import { WithID } from '../../../models';
import { Unit } from '../../unit/interfaces';
import { BattleParty } from './battle-party';

export interface BattleState {
  party: BattleParty;
  enemyParty: BattleParty;
  units: { [key: string]: WithID<Unit> };
}