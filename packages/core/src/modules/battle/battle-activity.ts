import { mergeDeepWith, add, complement, prop, sum } from "ramda";
import { injectable } from "inversify";
import { PartyService, PartyID } from "@modules/party";
import { GameService } from "@modules/game";
import { IActivityHandler, Activity } from "@modules/activity";
import { isAlive } from "@modules/unit";
import { BattleService } from "./battle-service";
import { BattleID } from "./interfaces";
import { calculateLoot } from "./lib";

export type BattleState = { battleId: BattleID };
export type BattleStartArgs = { partyId: PartyID; involvedPartyId: PartyID };

@injectable()
export class BattleActivity implements IActivityHandler<BattleStartArgs, BattleState> {
  constructor(
    private partyService: PartyService,
    private battleService: BattleService,
    private gameService: GameService,
  ) {}

  start({ partyId, involvedPartyId }: BattleStartArgs): BattleState {
    return {
      battleId: this.battleService.startBattle(partyId, involvedPartyId),
    };
  }

  isRunnable({ partyId, involvedPartyId }: BattleStartArgs) {
    return this.partyService.isPartyAlive(partyId) && this.partyService.isPartyAlive(involvedPartyId);
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

    const [winnerPartyId, looserPartyId] = this.partyService.isPartyAlive(battle.partyId)
      ? [battle.partyId, battle.defenderPartyId]
      : [battle.defenderPartyId, battle.partyId];

    const partyStash = this.partyService.clearPartyStash(looserPartyId);
    const winnerUnits = this.partyService.getPartyUnits(winnerPartyId);
    const looserUnits = this.partyService.getPartyUnits(looserPartyId);
    const loot = calculateLoot(looserUnits);
    const mergedLoot = mergeDeepWith(add, loot, partyStash);

    this.partyService.collectLoot(winnerPartyId, mergedLoot);

    const diedWinnerUnits = winnerUnits.filter(complement(isAlive));

    this.gameService.increaseDifficulty(sum(looserUnits.map(x => x.level)));

    this.partyService.removeUnitFromParty(winnerPartyId, diedWinnerUnits.map(prop("id")));
    this.partyService.removeUnitFromParty(looserPartyId, looserUnits.map(prop("id")));

    this.partyService.removeParty(looserPartyId);
    this.battleService.removeBattle(state.battleId);
  }
}
