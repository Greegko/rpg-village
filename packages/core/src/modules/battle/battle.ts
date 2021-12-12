import { all, complement, chain, concat, forEach, clone } from "ramda";

import { EffectService, isPartyEffect } from "@modules/skill";
import { Unit, isAlive } from "@modules/unit";
import { sample } from "@lib/sample";

import { BattleStats, BattleParty, BattleState } from "./interfaces";
import { calculateBattleStats } from "./lib";

export class Battle {
  private battleState: BattleState;
  private effectService: EffectService;

  constructor(effectService: EffectService, attackerParty: Unit[], defenderParty: Unit[]) {
    this.effectService = effectService;
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
    return (
      areAllDead(this.battleState.attackerParty.units) ||
      areAllDead(this.battleState.defenderParty.units)
    );
  }

  private createStartBattleState(attackerPartyUnits: Unit[], defenderPartyUnits: Unit[]): BattleState {
    return {
      attackerParty: this.calculateBattleParty(attackerPartyUnits),
      defenderParty: this.calculateBattleParty(defenderPartyUnits)
    };
  }

  private calculateBattleParty(units: Unit[]): BattleParty {
    return {
      units,
      effects: chain(unit => this.effectService.getUnitEffects(unit).filter(isPartyEffect), units),
    };
  }

  private handlePartyAttack(attackerParty: BattleParty, defenderParty: BattleParty) {
    forEach((attackerUnit) => {
      const defenderUnit = sample(defenderParty.units.filter(isAlive));

      const [ attackerUnitStats, defenderUnitStats ] = [this.getBattleStats(attackerUnit, attackerParty), this.getBattleStats(defenderUnit, defenderParty)];

      defenderUnit.hp = Math.max(0, defenderUnit.hp - Math.max(attackerUnitStats.dmg - defenderUnitStats.armor, 0));
    }, attackerParty.units.filter(isAlive));
  }

  private getBattleStats(unit: Unit, battleParty: BattleParty): BattleStats {
    return calculateBattleStats(unit.dmg, unit.armor, concat(this.effectService.getUnitEffects(unit), battleParty.effects));
  }
}
