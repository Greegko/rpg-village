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
  private battleInstances: Record<BattleID, Battle> = {};

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
    return this.getBattleInstance(battleId).isDone();
  }

  turnBattle(battleId: BattleID): void {
    const battleState = this.getBattleInstance(battleId).turn();
    forEachObjIndexed(unit => this.updateUnit(unit), battleState.units);
  }

  removeBattle(battleId: BattleID): void {
    this.battleStore.remove(battleId);
    delete this.battleInstances[battleId];
  }

  private updateUnit(unit: WithID<Unit>): void {
    this.unitStore.update(unit.id, { hp: unit.hp });
  }

  private getBattleInstance(battleId: BattleID): Battle {
    if (!this.battleInstances[battleId]) {
      const battleState = this.battleStore.get(battleId);
      this.battleInstances[battleId] = new Battle(
        this.effectService,
        this.getPartyUnits(battleState.attackerPartyId),
        this.getPartyUnits(battleState.defenderPartyId)
      );
    }

    return this.battleInstances[battleId];
  }

  private getPartyUnits(partyId: PartyID): WithID<Unit>[] {
    return this.partyService.getParty(partyId).unitIds.map(unitId => this.unitStore.get(unitId));
  }
}
