import { inject, injectable } from 'inversify';
import { UnitStore, isAlive, isHero, PartyService, PartyID, WithID } from "../../../../core-src";
import { IActivityTaskHandler, ActivityTask } from '../../activity';
import { BattleService } from '../battle-service';
import { BattleID } from '../interfaces';
import { Unit, Party, HeroService } from '../../../models';
import { sum, all, complement, prop, any } from 'ramda';

export type BattleState = { enemyPartyId: PartyID, battleId: BattleID };
export type BattleStartArgs = { enemyPartyId: PartyID };

@injectable()
export class BattleActivity implements IActivityTaskHandler<BattleStartArgs, BattleState> {

  constructor(
    @inject('UnitStore') private unitStore: UnitStore<Unit>,
    @inject('PartyService') private partyService: PartyService<Party>,
    @inject('HeroService') private heroService: HeroService,
    @inject('BattleService') private battleService: BattleService
  ) { }

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

  private _getPartyUnits(partyId: PartyID): WithID<Unit>[] {
    return this.partyService.getParty(partyId).unitIds.map(unitId => this.unitStore.get(unitId));
  }

  private _anyUnitAliveInParty(partyId: PartyID) {
    return any(isAlive, this._getPartyUnits(partyId));
  }

  private _updateParty(partyId: PartyID, units: WithID<Unit>[], earnedXP: number) {
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
