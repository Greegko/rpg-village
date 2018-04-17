import { injectable, inject } from 'inversify';
import { Battle } from './battle';
import { BattleID } from './interfaces';
import { BattleStore } from './battle-store';
import { Entity, EffectService, PartyService, PartyID, UnitStore } from '@greegko/rpg-model';
import { forEachObjIndexed } from 'ramda';

@injectable()
export class BattleService {

  private _battleCaches: { [key: string]: Battle } = {};

  constructor(
    @inject('BattleStore') private battleStore: BattleStore,
    @inject('PartyService') private partyService: PartyService,
    @inject('UnitStore') private unitStore: UnitStore,
    @inject('EffectService') private effectService: EffectService
  ){ }

  startBattle(partyId: PartyID, enemyPartyId: PartyID): BattleID {
    return this.battleStore.addBattle({ partyId, enemyPartyId });
  }

  isDoneBattle(battleId: BattleID): boolean {
    return this._getBattle(battleId).isDone();
  }

  turnBattle(battleId: BattleID) {
    const battleState = this._getBattle(battleId).turn();
    forEachObjIndexed(unit => this._updateUnit(unit), battleState.units);
  }

  removeBattle(battleId: BattleID) {
    this.battleStore.removeBattle(battleId);
    delete this._battleCaches[battleId];
  }

  private _updateUnit(unit: Entity) {
    this.unitStore.updateUnit(unit.id, { hp: unit.hp });
  }

  private _getBattle(battleId: BattleID): Battle {
    if (!this._battleCaches[battleId]) {
      const battleState = this.battleStore.getBattle(battleId);
      this._battleCaches[battleId] = new Battle(
        this.effectService,
        this._getPartyUnits(battleState.partyId),
        this._getPartyUnits(battleState.enemyPartyId)
      );
    }

    return this._battleCaches[battleId];
  }

  private _getPartyUnits(partyId: PartyID) {
    return this.partyService.getParty(partyId).unitIds.map(unitId => this.unitStore.getUnit(unitId));
  }

}
