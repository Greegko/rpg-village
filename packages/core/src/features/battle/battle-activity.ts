import { injectable } from "inversify";

import { EventSystem } from "@core";

import { IActivityHandler } from "@features/activity";
import { PartyActivity, PartyID, PartyService } from "@features/party";

import { BattleService } from "./battle-service";
import { BattleID } from "./interfaces";
import { BattleEvent } from "./types";

type BattleState = { battleId: BattleID };
type BattleStartArgs = { partyId: PartyID; involvedPartyId: PartyID };

@injectable()
export class BattleActivity implements IActivityHandler<PartyActivity<BattleState, BattleStartArgs>> {
  constructor(
    private partyService: PartyService,
    private battleService: BattleService,
    private eventSystem: EventSystem,
  ) {}

  start({ partyId, involvedPartyId }: BattleStartArgs): BattleState {
    return {
      battleId: this.battleService.startBattle(partyId, involvedPartyId),
    };
  }

  isRunnable({ partyId, involvedPartyId }: BattleStartArgs) {
    return this.partyService.isPartyAlive(partyId) && this.partyService.isPartyAlive(involvedPartyId);
  }

  execute(activity: PartyActivity<BattleState>): BattleState {
    this.battleService.turnBattle(activity.state.battleId);

    return activity.state;
  }

  isDone({ state: { battleId } }: PartyActivity<BattleState>): boolean {
    return this.battleService.isDoneBattle(battleId);
  }

  resolve({ state }: PartyActivity<BattleState>) {
    const battle = this.battleService.getBattle(state.battleId);

    const [winnerPartyId, looserPartyId] = this.partyService.isPartyAlive(battle.partyId)
      ? [battle.partyId, battle.defenderPartyId]
      : [battle.defenderPartyId, battle.partyId];

    this.eventSystem.fire(BattleEvent.Finished, { looserPartyId, winnerPartyId });

    this.battleService.removeBattle(state.battleId);
  }
}
