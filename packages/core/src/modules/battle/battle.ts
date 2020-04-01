import { all, complement, prop, map, chain, concat, pipe, contains, forEach, mergeAll } from 'ramda';
import { isAlive, UnitID } from '../unit';
import { EffectService, isPartyEffect } from '../skill';
import { Effect } from '../../models';
import { Unit } from '../unit';
import { BattleStats, BattleParty, BattleUnit, BattleState } from './interfaces';
import { calculateBattleStats } from './lib';
import { sample } from '../../lib/sample';

export class Battle {
  private battleState: BattleState;
  private effectService: EffectService;

  constructor(effectService: EffectService, party: Unit[], defenderParty: Unit[]) {
    this.effectService = effectService;
    this.battleState = this.createStartBattleState(party, defenderParty);
  }

  turn(): BattleState {
    const unitAttackOrder = concat(this.battleState.attackerParty.unitIds, this.battleState.defenderParty.unitIds);
    forEach(this.attackWithUnit, unitAttackOrder);

    return this.battleState;
  }

  getState(): BattleState {
    return this.battleState;
  }

  isDone(): boolean {
    const areAllDead = all(complement(isAlive));
    return areAllDead(this.getPartyUnits(this.battleState.attackerParty)) ||
      areAllDead(this.getPartyUnits(this.battleState.defenderParty));
  }

  private createStartBattleState(partyUnits: Unit[], defenderPartyUnits: Unit[]): BattleState {
    const units = concat(partyUnits, defenderPartyUnits);
    return {
      attackerParty: this.calculateParty(partyUnits),
      defenderParty: this.calculateParty(defenderPartyUnits),
      units: mergeAll(map(unit => ({ [unit.id]: unit }), units))
    };
  }

  private calculateParty(units: Unit[]): BattleParty {
    return {
      unitIds: map(prop('id'), units),
      effects: chain(unit => this.effectService.getUnitEffects(unit).filter(isPartyEffect), units)
    };
  }

  private getPartyUnits(party: BattleParty): Unit[] {
    return map(unitId => this.battleState.units[unitId], party.unitIds);
  }

  private get attackWithUnit() {
    return pipe(
      (attackerId: UnitID) => [attackerId, this.getUnitFromdefenderParty(attackerId)],
      map(unitId => this.battleUnitTransformer(unitId)),
      ([attacker, defender]) => this.handleAttack(attacker, defender)
    );
  }

  private getUnitFromdefenderParty(unitId: UnitID): UnitID {
    const isInNondefenderParty = contains(unitId, this.battleState.attackerParty.unitIds);
    const targetParty = isInNondefenderParty ? this.battleState.defenderParty : this.battleState.attackerParty;

    return sample(targetParty.unitIds);
  }

  private getUnitParty(unitId: UnitID): BattleParty {
    const isEnemy = contains(unitId, this.battleState.defenderParty.unitIds);
    return isEnemy ? this.battleState.attackerParty : this.battleState.defenderParty;
  }

  private battleUnitTransformer(unitId: UnitID): BattleUnit {
    const unit = this.battleState.units[unitId];
    const party = this.getUnitParty(unitId);
    return { unitId: unit.id, battleStats: this.getBattleStats(unit, party.effects) };
  }

  private handleAttack(attacker: BattleUnit, defender: BattleUnit): void {
    this.dmgUnit(this.battleState.units[defender.unitId], attacker.battleStats.dmg);
  }

  private dmgUnit(unit: Unit, dmg: number): void {
    unit.hp = Math.max(0, unit.hp - dmg);
  }

  private getBattleStats(unit: Unit, partyEffects: Effect[]): BattleStats {
    return calculateBattleStats(unit.dmg, unit.armor, concat(this.effectService.getUnitEffects(unit), partyEffects));
  }
}
