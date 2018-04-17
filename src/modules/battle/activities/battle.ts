import { inject, injectable } from 'inversify';
import { UnitStore, isAlive, Unit, IActivityTaskHandler, ActivityTask, HeroService, isHero, PartyService, PartyID } from '@greegko/rpg-model';
import { BattleService } from '../battle-service';
import { BattleID } from '../interfaces';
import { sum, all, complement, prop, any } from 'ramda';

export type BattleState = { enemyPartyId: PartyID, battleId: BattleID };
export type BattleStartArgs = { enemyPartyId: PartyID };

@injectable()
export class BattleActivity implements IActivityTaskHandler<BattleStartArgs, BattleState> {

  constructor(
    @inject('UnitStore') private unitStore: UnitStore,
    @inject('PartyService') private partyService: PartyService,
    @inject('HeroService') private heroService: HeroService,
    @inject('BattleService') private battleService: BattleService
  ){}

  start(partyId: PartyID, { enemyPartyId }: BattleStartArgs): ActivityTask<BattleState> {
    return {
      type: 'battle',
      state: { enemyPartyId, battleId: this.battleService.startBattle(partyId, enemyPartyId) },
      partyId
    };
  }

  isRunnable(partyId: PartyID, { enemyPartyId }: BattleStartArgs) {
    return this._anyUnitAliveInParty(partyId) && this._anyUnitAliveInParty(enemyPartyId);
  }

  getSubTask(): ActivityTask<any> {
    return undefined;
  }

  execute(activity: ActivityTask<BattleState>): BattleState {
    this.battleService.turnBattle(activity.state.battleId);

    return activity.state;
  }

  isDone({ state: { battleId } }: ActivityTask<BattleState>): boolean {
    return this.battleService.isDoneBattle(battleId);
  }

  resolve(activity: ActivityTask<BattleState>) {
    const partyUnits = this._getPartyUnits(activity.partyId);
    const enemyPartyUnits = this._getPartyUnits(activity.state.enemyPartyId);

    this._updateParty(activity.partyId, partyUnits, this._sumDeadUnitsXP(enemyPartyUnits));
    this._updateParty(activity.state.enemyPartyId, enemyPartyUnits, this._sumDeadUnitsXP(partyUnits));
  }

  private _getPartyUnits(partyId: PartyID): Unit[] {
    return this.partyService.getParty(partyId).unitIds.map(unitId => this.unitStore.getUnit(unitId));
  }

  private _anyUnitAliveInParty(partyId: PartyID) {
    return any(isAlive, this._getPartyUnits(partyId));
  }

  private _updateParty(partyId: PartyID, units: Unit[], earnedXP: number) {
    if (all(complement(isAlive), units)) {
      this.partyService.removeParty(partyId);
      return;
    }

    const aliveUnits = units.filter(isAlive);
    this.partyService.updateParty(partyId, { unitIds: aliveUnits.map(prop('id')) });

    aliveUnits.filter(isHero).forEach(hero => this.heroService.gainXp(hero.id, earnedXP));
  }

  private _sumDeadUnitsXP(units: Unit[]): number {
    return sum(units.filter(complement(isAlive)).map(unit => unit.level * 25))
  }

}
