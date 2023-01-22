import { all, clone, complement, forEach } from "ramda";

import { sample } from "@lib/sample";

import { calculateUnitStatsWithEffects } from "@models/effect";
import { Unit, isAlive } from "@modules/unit";

import { BattleParty, BattleState } from "./interfaces";

export class Battle {
  private battleState: BattleState;

  constructor(attackerParty: Unit[], defenderParty: Unit[]) {
    this.battleState = this.createStartBattleState(clone(attackerParty), clone(defenderParty));
  }

  turn(): BattleState {
    this.handlePartyAttack(this.battleState.attackerParty, this.battleState.defenderParty);
    this.handlePartyAttack(this.battleState.defenderParty, this.battleState.attackerParty);

    return this.battleState;
  }

  getState(): BattleState {
    return this.battleState;
  }

  isDone(): boolean {
    const areAllDead = all(complement(isAlive));
    return areAllDead(this.battleState.attackerParty) || areAllDead(this.battleState.defenderParty);
  }

  private createStartBattleState(attackerPartyUnits: Unit[], defenderPartyUnits: Unit[]): BattleState {
    return {
      attackerParty: attackerPartyUnits,
      defenderParty: defenderPartyUnits,
    };
  }

  private handlePartyAttack(attackerParty: BattleParty, defenderParty: BattleParty) {
    forEach(attackerUnit => {
      const defenderUnit = sample(defenderParty.filter(isAlive));

      const [attackerUnitStats, defenderUnitStats] = [
        calculateUnitStatsWithEffects(attackerUnit),
        calculateUnitStatsWithEffects(defenderUnit),
      ];

      defenderUnit.hp = Math.max(0, defenderUnit.hp - Math.max(attackerUnitStats.dmg - defenderUnitStats.armor, 0));
    }, attackerParty.filter(isAlive));
  }
}
