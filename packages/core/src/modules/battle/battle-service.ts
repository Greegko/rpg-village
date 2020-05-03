import { injectable, inject } from 'inversify';
import { PartyService, PartyID } from '../party';
import { UnitService } from '../unit';
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
    @inject('UnitService') private unitService: UnitService,
    @inject('EffectService') private effectService: EffectService
  ) { }

  getBattle(battleId: BattleID): BattleStoreState {
    return this.battleStore.get(battleId);
  }

  startBattle(partyId: PartyID, defenderPartyId: PartyID): BattleID {
    return this.battleStore.add({ partyId, defenderPartyId }).id;
  }

  isDoneBattle(battleId: BattleID): boolean {
    return this.getBattleInstance(battleId).isDone();
  }

  turnBattle(battleId: BattleID): void {
    const battle = this.getBattleInstance(battleId);
    const preTurnState = battle.getState();
    const battleState = battle.turn();

    forEachObjIndexed(unit => {
      const dmg = preTurnState[unit.id] - unit.hp;

      if (dmg > 0) {
        this.unitService.dmgUnit(unit.id, dmg);
      }
    }, battleState.units);
  }

  removeBattle(battleId: BattleID): void {
    this.battleStore.remove(battleId);
    delete this.battleInstances[battleId];
  }

  private getBattleInstance(battleId: BattleID): Battle {
    if (!this.battleInstances[battleId]) {
      const battleState = this.battleStore.get(battleId);
      this.battleInstances[battleId] = new Battle(
        this.effectService,
        this.partyService.getPartyUnits(battleState.partyId),
        this.partyService.getPartyUnits(battleState.defenderPartyId)
      );
    }

    return this.battleInstances[battleId];
  }
}
