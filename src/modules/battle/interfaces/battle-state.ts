import { Unit, UnitID } from '../../unit/interfaces';
import { BattleParty } from './battle-party';

export interface BattleState {
  attackerParty: BattleParty;
  defenderParty: BattleParty;
  units: Record<UnitID, Unit>;
}