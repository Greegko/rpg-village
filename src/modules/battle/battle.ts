import { all, complement, prop, map, chain, concat, pipe, contains, forEach, mergeAll } from 'ramda';
import { isAlive, UnitID } from '@greegko/rpg-model';
import { EffectService, isPartyEffect } from '../skill';
import { Effect, Entity, Unit } from '../../models';
import { BattleStats, BattleParty, BattleUnit, BattleState } from './interfaces';
import { calculateBattleStats } from './lib';
import { sample } from '../../lib';

export class Battle {

  private _battleState: BattleState;
  private _effectService: EffectService;

  constructor(effectService: EffectService, party: Unit[], enemyParty: Unit[]) {
    this._battleState = this._createStartBattleState(party, enemyParty);
    this._effectService = effectService;
  }

  turn(): BattleState {
    const unitAttackOrder = concat(this._battleState.party.unitIds, this._battleState.enemyParty.unitIds);
    forEach(this._attackWithUnit, unitAttackOrder);

    return this._battleState;
  }

  isDone(): boolean {
    const areAllDead = all(complement(isAlive));
    return areAllDead(this._getPartyUnits(this._battleState.party)) ||
           areAllDead(this._getPartyUnits(this._battleState.enemyParty));
  }

  private _createStartBattleState(partyUnits: Unit[], enemyPartyUnits: Unit[]): BattleState {
    return {
      party: this._calculateParty(partyUnits),
      enemyParty: this._calculateParty(enemyPartyUnits),
      units:  mergeAll(map(unit => ({ [unit.id]: unit }), concat(partyUnits, enemyPartyUnits)))
    };
  }

  private _calculateParty(units: Entity[]): BattleParty {
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
      (attackerId: UnitID) => [attackerId, this._getUnitFromEnemyParty(attackerId)],
      map(this._battleUnitTransformer),
      ([attacker, defender]) => this._handleAttack(attacker, defender)
    );
  }

  private _getUnitFromEnemyParty(unitId: UnitID): UnitID {
    const isInNonEnemyParty = contains(unitId, this._battleState.party.unitIds);
    const targetParty = isInNonEnemyParty ? this._battleState.enemyParty : this._battleState.party;

    return sample(targetParty.unitIds);
  }

  private _getUnitParty(unitId: UnitID): BattleParty {
    const isEnemy = contains(unitId, this._battleState.enemyParty.unitIds);
    return isEnemy ? this._battleState.party : this._battleState.enemyParty;
  }

  private _battleUnitTransformer(unitId: UnitID): BattleUnit {
    const unit = this._battleState.units[unitId];
    const party = this._getUnitParty(unitId);
    return { unitId: unit.id, battleStats: this._getBattleStats(unit, party.effects) };
  }

  private _handleAttack(attacker: BattleUnit, defender: BattleUnit) {
    return this._dmgUnit(this._battleState.units[defender.unitId], attacker.battleStats.dmg);
  }

  private _dmgUnit(unit: Unit, dmg: number) {
    unit.hp = Math.max(0, unit.hp - dmg);
  }

  private _getBattleStats(unit: Entity, partyEffects: Effect[]): BattleStats {
    return calculateBattleStats(unit.dmg, unit.armor, concat(this._effectService.getUnitEffects(unit), partyEffects));
  }

}
