import { injectable, inject } from 'inversify';
import { PartyService, PartyID } from '../party';
import { UnitStore, Unit } from '../unit';
import { WithID } from '../../models';
import { EffectService } from '../skill';
import { Battle } from './battle';
import { BattleID, BattleStoreState } from './interfaces';
import { BattleStore } from './battle-store';
import { forEachObjIndexed } from 'ramda';

@injectable()
export class BattleService {
  private _battleCaches: { [key: string]: Battle } = {};

  constructor(
    @inject('BattleStore') private battleStore: BattleStore,
    @inject('PartyService') private partyService: PartyService,
    @inject('UnitStore') private unitStore: UnitStore,
    @inject('EffectService') private effectService: EffectService
  ) { }

  getBattle(battleId: BattleID): WithID<BattleStoreState> {
    return this.battleStore.get(battleId);
  }

  startBattle(attackerPartyId: PartyID, defenderPartyId: PartyID): BattleID {
    return this.battleStore.add({ attackerPartyId, defenderPartyId }).id;
  }

  isDoneBattle(battleId: BattleID): boolean {
    return this._getBattle(battleId).isDone();
  }

  turnBattle(battleId: BattleID): void {
    const battleState = this._getBattle(battleId).turn();
    forEachObjIndexed(unit => this._updateUnit(unit), battleState.units);
  }

  removeBattle(battleId: BattleID): void {
    this.battleStore.remove(battleId);
    delete this._battleCaches[battleId];
  }

  private _updateUnit(unit: WithID<Unit>): void {
    this.unitStore.update(unit.id, { hp: unit.hp });
  }

  private _getBattle(battleId: BattleID): Battle {
    if (!this._battleCaches[battleId]) {
      const battleState = this.battleStore.get(battleId);
      this._battleCaches[battleId] = new Battle(
        this.effectService,
        this._getPartyUnits(battleState.attackerPartyId),
        this._getPartyUnits(battleState.defenderPartyId)
      );
    }

    return this._battleCaches[battleId];
  }

  private _getPartyUnits(partyId: PartyID): WithID<Unit>[] {
    return this.partyService.getParty(partyId).unitIds.map(unitId => this.unitStore.get(unitId));
  }
}
