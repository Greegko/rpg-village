import { Unit } from "@modules/unit";

export interface BattleState {
  attackerParty: BattleParty;
  defenderParty: BattleParty;
}

export type BattleParty = Unit[];
