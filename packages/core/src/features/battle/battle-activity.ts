import { injectable } from "inversify";

import { EventSystem } from "@core";

import { Activity, IActivityHandler } from "@features/activity";
import { PartyID, PartyService } from "@features/party";

import { BattleService } from "./battle-service";
import { BattleEvent, BattleID } from "./interfaces";

type BattleState = { battleId: BattleID };

export type BattleActivityStartArgs = { partyId: PartyID; involvedPartyId: PartyID };

@injectable()
export class BattleActivity implements IActivityHandler<Activity<BattleState, BattleActivityStartArgs>> {
  constructor(
    private partyService: PartyService,
    private battleService: BattleService,
    private eventSystem: EventSystem,
  ) {}

  start({ partyId, involvedPartyId }: BattleActivityStartArgs): BattleState {
    return {
      battleId: this.battleService.startBattle(partyId, involvedPartyId),
    };
  }

  isRunnable({ partyId, involvedPartyId }: BattleActivityStartArgs) {
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

    this.eventSystem.fire(BattleEvent.Finished, { looserPartyId, winnerPartyId });

    this.battleService.removeBattle(state.battleId);
  }
}
