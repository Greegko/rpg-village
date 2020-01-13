import { inject, injectable } from 'inversify';
import { PartyService, PartyID } from "../party";
import { UnitStore, isAlive, isHero, Unit, UnitService } from "../unit";
import { IActivityHandler, Activity } from '../activity';
import { BattleService } from './battle-service';
import { BattleID } from './interfaces';
import { WithID } from '../../models';
import { sum, all, complement, prop, any } from 'ramda';

export type BattleState = { battleId: BattleID };
export type BattleStartArgs = { attackerPartyId: PartyID, defenderPartyId: PartyID };

@injectable()
export class BattleActivity implements IActivityHandler<BattleStartArgs, BattleState> {
  constructor(
    @inject('UnitStore') private unitStore: UnitStore,
    @inject('PartyService') private partyService: PartyService,
    @inject('UnitService') private unitService: UnitService,
    @inject('BattleService') private battleService: BattleService
  ) { }

  start({ attackerPartyId, defenderPartyId }: BattleStartArgs): BattleState {
    return {
      battleId: this.battleService.startBattle(attackerPartyId, defenderPartyId),
    };
  }

  isRunnable({ attackerPartyId, defenderPartyId }: BattleStartArgs) {
    return this._anyUnitAliveInParty(attackerPartyId) && this._anyUnitAliveInParty(defenderPartyId);
  }

  execute(activity: Activity<BattleState>): BattleState {
    this.battleService.turnBattle(activity.state.battleId);

    return activity.state;
  }

  isDone({ state: { battleId } }: Activity<BattleState>): boolean {
    return this.battleService.isDoneBattle(battleId);
  }

  resolve({ state }: Activity<BattleState>) {
    const battle = this.battleService.getBattle(state.battleId);

    const attackerPartyIdUnits = this._getPartyUnits(battle.attackerPartyId);
    const defenderPartyIdUnits = this._getPartyUnits(battle.defenderPartyId);

    this._updateParty(battle.attackerPartyId, attackerPartyIdUnits, this._sumDeadUnitsXP(defenderPartyIdUnits));
    this._updateParty(battle.defenderPartyId, defenderPartyIdUnits, this._sumDeadUnitsXP(attackerPartyIdUnits));

    this.battleService.removeBattle(state.battleId);
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

    aliveUnits.filter(isHero).forEach(unit => this.unitService.gainXp(unit.id, earnedXP));
  }

  private _sumDeadUnitsXP(units: Unit[]): number {
    return sum(units.filter(complement(isAlive)).map(unit => unit.level * 25))
  }
}
