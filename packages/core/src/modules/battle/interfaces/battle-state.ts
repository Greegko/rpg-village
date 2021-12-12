import { Unit } from "@modules/unit";
import { Effect } from "@models/effect";

export interface BattleState {
  attackerParty: BattleParty;
  defenderParty: BattleParty;
}

export interface BattleParty {
  units: Unit[];
  effects: Effect[];
}

export interface BattleStats {
  dmg: number;
  armor: number;
  evasion: number;
  criticalChance: number;
}
