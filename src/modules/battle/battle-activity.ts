import { inject, injectable } from 'inversify';
import { PartyService, PartyID } from "../party";
import { IActivityHandler, Activity } from '../activity';
import { BattleService } from './battle-service';
import { BattleID } from './interfaces';
import { calculateLoot } from './lib';
import { mergeDeepWith, add } from 'ramda';

export type BattleState = { battleId: BattleID };
export type BattleStartArgs = { attackerPartyId: PartyID, defenderPartyId: PartyID };

@injectable()
export class BattleActivity implements IActivityHandler<BattleStartArgs, BattleState> {
  constructor(
    @inject('PartyService') private partyService: PartyService,
    @inject('BattleService') private battleService: BattleService
  ) { }

  start({ attackerPartyId, defenderPartyId }: BattleStartArgs): BattleState {
    return {
      battleId: this.battleService.startBattle(attackerPartyId, defenderPartyId),
    };
  }

  isRunnable({ attackerPartyId, defenderPartyId }: BattleStartArgs) {
    return this.partyService.isPartyAlive(attackerPartyId) && this.partyService.isPartyAlive(defenderPartyId);
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

    const [winnerPartyId, looserPartyId] = this.partyService.isPartyAlive(battle.attackerPartyId) ?
      [battle.attackerPartyId, battle.defenderPartyId] :
      [battle.defenderPartyId, battle.attackerPartyId];

    const partyStash = this.partyService.getParty(looserPartyId).stash;
    const loot = calculateLoot(this.partyService.getPartyUnits(looserPartyId));
    const mergedLoot = mergeDeepWith(add, loot, partyStash);

    this.partyService.collectLoot(winnerPartyId, mergedLoot);
    this.partyService.removeParty(looserPartyId);
    this.battleService.removeBattle(state.battleId);
  }
}
