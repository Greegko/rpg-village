import { Unit } from "@features/unit";

export interface BattleState {
  attackerParty: BattleParty;
  defenderParty: BattleParty;
}

export type BattleParty = Unit[];
