import { Unit } from "@modules/unit";

export interface BattleState {
  attackerParty: BattleParty;
  defenderParty: BattleParty;
}

export type BattleParty = Unit[];

export interface BattleStats {
  dmg: number;
  armor: number;
  evasion: number;
  criticalChance: number;
}
