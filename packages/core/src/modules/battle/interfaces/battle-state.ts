import { Unit, UnitID } from "@modules/unit";
import { BattleParty } from "./battle-party";

export interface BattleState {
  attackerParty: BattleParty;
  defenderParty: BattleParty;
  units: Record<UnitID, Unit>;
}
