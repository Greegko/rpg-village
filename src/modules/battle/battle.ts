import { all, complement, prop, map, chain, concat, pipe, contains, forEach, mergeAll } from 'ramda';
import { isAlive, UnitID } from '../unit';
import { EffectService, isPartyEffect } from '../skill';
import { Effect, WithID } from '../../models';
import { Unit } from '../unit';
import { BattleStats, BattleParty, BattleUnit, BattleState } from './interfaces';
import { calculateBattleStats } from './lib';
import { sample } from '../../lib/sample';

export class Battle {

  private _battleState: BattleState;
  private _effectService: EffectService;

  constructor(effectService: EffectService, party: WithID<Unit>[], defenderParty: WithID<Unit>[]) {
    this._effectService = effectService;
    this._battleState = this._createStartBattleState(party, defenderParty);
  }

  turn(): BattleState {
    const unitAttackOrder = concat(this._battleState.attackerParty.unitIds, this._battleState.defenderParty.unitIds);
    forEach(this._attackWithUnit, unitAttackOrder);

    return this._battleState;
  }

  isDone(): boolean {
    const areAllDead = all(complement(isAlive));
    return areAllDead(this._getPartyUnits(this._battleState.attackerParty)) ||
      areAllDead(this._getPartyUnits(this._battleState.defenderParty));
  }

  private _createStartBattleState(partyUnits: WithID<Unit>[], defenderPartyUnits: WithID<Unit>[]): BattleState {
    const units = concat(partyUnits, defenderPartyUnits);
    return {
      attackerParty: this._calculateParty(partyUnits),
      defenderParty: this._calculateParty(defenderPartyUnits),
      units: mergeAll(map(unit => ({ [unit.id]: unit }), units))
    };
  }

  private _calculateParty(units: Unit[]): BattleParty {
    return {
      unitIds: map(prop('id'), units),
      effects: chain(unit => this._effectService.getUnitEffects(unit).filter(isPartyEffect), units)
    };
  }

  private _getPartyUnits(party: BattleParty): Unit[] {
    return map(unitId => this._battleState.units[unitId], party.unitIds);
  }

  private get _attackWithUnit() {
    return pipe(
      (attackerId: UnitID) => [attackerId, this._getUnitFromdefenderParty(attackerId)],
      map(x => this._battleUnitTransformer(x)),
      ([attacker, defender]) => this._handleAttack(attacker, defender)
    );
  }

  private _getUnitFromdefenderParty(unitId: UnitID): UnitID {
    const isInNondefenderParty = contains(unitId, this._battleState.attackerParty.unitIds);
    const targetParty = isInNondefenderParty ? this._battleState.defenderParty : this._battleState.attackerParty;

    return sample(targetParty.unitIds);
  }

  private _getUnitParty(unitId: UnitID): BattleParty {
    const isEnemy = contains(unitId, this._battleState.defenderParty.unitIds);
    return isEnemy ? this._battleState.attackerParty : this._battleState.defenderParty;
  }

  private _battleUnitTransformer(unitId: UnitID): BattleUnit {
    const unit = this._battleState.units[unitId];
    const party = this._getUnitParty(unitId);
    return { unitId: unit.id, battleStats: this._getBattleStats(unit, party.effects) };
  }

  private _handleAttack(attacker: BattleUnit, defender: BattleUnit): void {
    this._dmgUnit(this._battleState.units[defender.unitId], attacker.battleStats.dmg);
  }

  private _dmgUnit(unit: Unit, dmg: number): void {
    unit.hp = Math.max(0, unit.hp - dmg);
  }

  private _getBattleStats(unit: Unit, partyEffects: Effect[]): BattleStats {
    return calculateBattleStats(unit.dmg, unit.armor, concat(this._effectService.getUnitEffects(unit), partyEffects));
  }

}
