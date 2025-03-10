import { all, clone, complement, forEach } from "rambda";

import { sample } from "@rpg-village/core";

import { Unit, calculateUnitStatsWithEffects, isAlive } from "@features/unit";

import { BattleParty, BattleState } from "./interfaces";

export class Battle {
  private battleState: BattleState;

  constructor(attackerParty: Unit[], defenderParty: Unit[]) {
    this.battleState = this.initBattleState(clone(attackerParty), clone(defenderParty));
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

  private initBattleState(attackerPartyUnits: Unit[], defenderPartyUnits: Unit[]): BattleState {
    return {
      attackerParty: attackerPartyUnits.map(calculateUnitStatsWithEffects),
      defenderParty: defenderPartyUnits.map(calculateUnitStatsWithEffects),
    };
  }

  private handlePartyAttack(attackerParty: BattleParty, defenderParty: BattleParty) {
    forEach(attackerUnit => {
      const defenderUnit = sample(defenderParty.filter(isAlive));

      defenderUnit.hp = Math.max(0, defenderUnit.hp - Math.max(attackerUnit.dmg - defenderUnit.armor, 0));
    }, attackerParty.filter(isAlive));
  }
}
